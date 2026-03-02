import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.send',
];

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI,
  );
}

export function getGmailClient(refreshToken) {
  const auth = getOAuth2Client();
  auth.setCredentials({ refresh_token: refreshToken });
  return google.gmail({ version: 'v1', auth });
}

export function getAuthUrl() {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // always return refresh_token
  });
}

/** Read refresh token from request cookie, falling back to env var. */
export function getRefreshToken(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/gmail_refresh_token=([^;]+)/);
  if (match) return decodeURIComponent(match[1]);
  return process.env.GMAIL_REFRESH_TOKEN || null;
}

/** Get the value of a specific header from a Gmail message headers array. */
export function getHeader(headers = [], name) {
  const h = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return h?.value || '';
}

/** Decode base64url-encoded Gmail body data. */
export function decodeBase64(data) {
  return Buffer.from(
    data.replace(/-/g, '+').replace(/_/g, '/'),
    'base64',
  ).toString('utf-8');
}

/** Strip HTML tags to plain text (rough but sufficient for preview). */
function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Recursively extract plain-text body from a Gmail message payload. */
export function extractBody(payload) {
  if (!payload) return '';

  // Leaf node with data
  if (payload.body?.data) {
    const text = decodeBase64(payload.body.data);
    return payload.mimeType === 'text/html' ? stripHtml(text) : text;
  }

  if (!payload.parts) return '';

  // Prefer text/plain
  for (const part of payload.parts) {
    if (part.mimeType === 'text/plain' && part.body?.data) {
      return decodeBase64(part.body.data);
    }
  }
  // Recurse into multipart children
  for (const part of payload.parts) {
    const body = extractBody(part);
    if (body) return body;
  }
  // Fall back to text/html
  for (const part of payload.parts) {
    if (part.mimeType === 'text/html' && part.body?.data) {
      return stripHtml(decodeBase64(part.body.data));
    }
  }

  return '';
}

/**
 * Recursively extract attachment metadata from a Gmail message payload.
 * Returns an array of { filename, mimeType, size, attachmentId, messageId }.
 */
export function extractAttachments(payload, messageId) {
  const attachments = [];

  function traverse(part) {
    if (part.filename && part.body?.attachmentId) {
      attachments.push({
        filename: part.filename,
        mimeType: part.mimeType || 'application/octet-stream',
        size: part.body.size || 0,
        attachmentId: part.body.attachmentId,
        messageId,
      });
    }
    if (part.parts) {
      part.parts.forEach(traverse);
    }
  }

  traverse(payload);
  return attachments;
}

/** Chunk base64 string at 76 chars per line (standard MIME). */
function chunkBase64(data, lineLen = 76) {
  const chunks = [];
  for (let i = 0; i < data.length; i += lineLen) {
    chunks.push(data.slice(i, i + lineLen));
  }
  return chunks.join('\r\n');
}

/** Encode a MIME message string as base64url for the Gmail API. */
function toBase64url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Strip CR and LF from a value that will be used in an email header field. */
function sanitizeHeader(value) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ');
}

/**
 * Build a base64url-encoded RFC 2822 MIME email for the Gmail API.
 * Works for new emails, replies, and messages with attachments.
 *
 * @param {string}   opts.to           - Recipient address
 * @param {string}   opts.subject      - Subject line
 * @param {string}   opts.body         - Plain-text body
 * @param {string}  [opts.inReplyTo]   - Message-ID of email being replied to
 * @param {string}  [opts.references]  - References header value
 * @param {boolean} [opts.isReply]     - Prepend "Re:" if not already present
 * @param {Array}   [opts.attachments] - [{ name, type, data }] data = raw base64
 */
export function buildEmailRaw({
  to,
  subject,
  body,
  inReplyTo = '',
  references = '',
  isReply = false,
  attachments = [],
}) {
  const subjectLine =
    isReply && !subject.toLowerCase().startsWith('re:')
      ? `Re: ${subject}`
      : subject;

  const boundary = `==_Part_${Date.now()}_${Math.random().toString(36).slice(2)}==`;
  const hasAttachments = attachments.length > 0;

  const headers = [
    `To: ${sanitizeHeader(to)}`,
    `Subject: ${sanitizeHeader(subjectLine)}`,
    ...(inReplyTo ? [`In-Reply-To: ${sanitizeHeader(inReplyTo)}`] : []),
    ...(references ? [`References: ${sanitizeHeader(references || inReplyTo)}`] : []),
    `MIME-Version: 1.0`,
  ];

  if (!hasAttachments) {
    headers.push('Content-Type: text/plain; charset=UTF-8');
    return toBase64url([...headers, '', body].join('\r\n'));
  }

  // Multipart/mixed for emails with attachments
  headers.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);

  const parts = [
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    '',
    body,
  ];

  for (const att of attachments) {
    const safeType = att.type || 'application/octet-stream';
    const safeName = att.name || 'attachment';
    parts.push(
      `--${boundary}`,
      `Content-Type: ${safeType}; name="${safeName}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${safeName}"`,
      '',
      chunkBase64(att.data),
    );
  }

  parts.push(`--${boundary}--`);

  return toBase64url([...headers, '', ...parts].join('\r\n'));
}

/**
 * @deprecated Use buildEmailRaw({ isReply: true, … }) instead.
 */
export function buildReplyRaw({ to, subject, body, inReplyTo, references }) {
  return buildEmailRaw({ to, subject, body, inReplyTo, references, isReply: true });
}
