/**
 * @jest-environment node
 */
import {
  getHeader,
  decodeBase64,
  extractBody,
  extractAttachments,
  buildEmailRaw,
  buildReplyRaw,
  getRefreshToken,
  getSalesRefreshToken,
} from '../../lib/gmail';

// Helper: decode base64url back to a string
function fromBase64url(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf-8');
}

// ─── getHeader ─────────────────────────────────────────────────────────────

describe('getHeader', () => {
  const headers = [
    { name: 'From', value: 'alice@example.com' },
    { name: 'Subject', value: 'Hello World' },
    { name: 'Content-Type', value: 'text/plain' },
  ];

  it('finds a header by exact name', () => {
    expect(getHeader(headers, 'Subject')).toBe('Hello World');
  });

  it('is case-insensitive', () => {
    expect(getHeader(headers, 'subject')).toBe('Hello World');
    expect(getHeader(headers, 'SUBJECT')).toBe('Hello World');
    expect(getHeader(headers, 'sUbJeCt')).toBe('Hello World');
  });

  it('returns empty string when header is not found', () => {
    expect(getHeader(headers, 'X-Custom-Header')).toBe('');
  });

  it('returns empty string for an empty headers array', () => {
    expect(getHeader([], 'Subject')).toBe('');
  });

  it('returns empty string for undefined headers (default param)', () => {
    expect(getHeader(undefined, 'Subject')).toBe('');
  });
});

// ─── decodeBase64 ──────────────────────────────────────────────────────────

describe('decodeBase64', () => {
  it('decodes a standard base64url string', () => {
    const encoded = Buffer.from('Hello World').toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    expect(decodeBase64(encoded)).toBe('Hello World');
  });

  it('handles - and _ characters from the base64url alphabet', () => {
    // Byte sequence that produces + and / in standard base64
    const bytes = Buffer.from([0xfb, 0xff, 0xfe]);
    const b64url = bytes.toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    expect(decodeBase64(b64url)).toBe(bytes.toString('utf-8'));
  });

  it('decodes an empty string', () => {
    expect(decodeBase64('')).toBe('');
  });

  it('decodes a multi-line email body', () => {
    const text = 'Line 1\nLine 2\nLine 3';
    const encoded = Buffer.from(text).toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    expect(decodeBase64(encoded)).toBe(text);
  });

  it('decodes UTF-8 content', () => {
    const text = 'Héllo Wörld 😀';
    const encoded = Buffer.from(text).toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    expect(decodeBase64(encoded)).toBe(text);
  });
});

// ─── extractBody ──────────────────────────────────────────────────────────

describe('extractBody', () => {
  function b64url(str) {
    return Buffer.from(str).toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  it('returns empty string for null/undefined payload', () => {
    expect(extractBody(null)).toBe('');
    expect(extractBody(undefined)).toBe('');
  });

  it('extracts a simple text/plain body', () => {
    const payload = {
      mimeType: 'text/plain',
      body: { data: b64url('Plain text email') },
    };
    expect(extractBody(payload)).toBe('Plain text email');
  });

  it('strips HTML tags from text/html body', () => {
    const html = '<p>Hello <strong>World</strong></p>';
    const payload = {
      mimeType: 'text/html',
      body: { data: b64url(html) },
    };
    expect(extractBody(payload)).toBe('Hello World');
  });

  it('strips <style> blocks from HTML', () => {
    const html = '<style>.foo { color: red; }</style><p>Content</p>';
    const payload = {
      mimeType: 'text/html',
      body: { data: b64url(html) },
    };
    const result = extractBody(payload);
    expect(result).not.toContain('.foo');
    expect(result).toContain('Content');
  });

  it('decodes HTML entities in HTML body', () => {
    const html = '<p>AT&amp;T &lt;great&gt; company &quot;here&quot;&nbsp;!</p>';
    const payload = {
      mimeType: 'text/html',
      body: { data: b64url(html) },
    };
    const result = extractBody(payload);
    expect(result).toContain('AT&T');
    expect(result).toContain('<great>');
    expect(result).toContain('"here"');
  });

  it('prefers text/plain over text/html in multipart', () => {
    const payload = {
      mimeType: 'multipart/alternative',
      parts: [
        { mimeType: 'text/plain', body: { data: b64url('Plain version') } },
        { mimeType: 'text/html', body: { data: b64url('<p>HTML version</p>') } },
      ],
    };
    expect(extractBody(payload)).toBe('Plain version');
  });

  it('falls back to text/html when no text/plain part exists', () => {
    const payload = {
      mimeType: 'multipart/alternative',
      parts: [
        { mimeType: 'text/html', body: { data: b64url('<p>HTML only</p>') } },
      ],
    };
    expect(extractBody(payload)).toBe('HTML only');
  });

  it('recurses into nested multipart parts', () => {
    const payload = {
      mimeType: 'multipart/mixed',
      parts: [
        {
          mimeType: 'multipart/alternative',
          parts: [
            { mimeType: 'text/plain', body: { data: b64url('Nested plain') } },
          ],
        },
      ],
    };
    expect(extractBody(payload)).toBe('Nested plain');
  });

  it('returns empty string when payload has no data and no parts', () => {
    expect(extractBody({ mimeType: 'text/plain', body: {} })).toBe('');
  });
});

// ─── extractAttachments ───────────────────────────────────────────────────

describe('extractAttachments', () => {
  it('returns empty array when no attachments', () => {
    const payload = {
      mimeType: 'text/plain',
      body: { data: 'abc' },
    };
    expect(extractAttachments(payload, 'msg1')).toEqual([]);
  });

  it('extracts a single attachment', () => {
    const payload = {
      mimeType: 'multipart/mixed',
      body: {},
      parts: [
        { mimeType: 'text/plain', body: { data: 'body' } },
        {
          filename: 'document.pdf',
          mimeType: 'application/pdf',
          body: { attachmentId: 'att123', size: 1024 },
        },
      ],
    };
    const result = extractAttachments(payload, 'msg1');
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      filename: 'document.pdf',
      mimeType: 'application/pdf',
      size: 1024,
      attachmentId: 'att123',
      messageId: 'msg1',
    });
  });

  it('extracts multiple attachments from nested parts', () => {
    const payload = {
      mimeType: 'multipart/mixed',
      body: {},
      parts: [
        {
          filename: 'file1.pdf',
          mimeType: 'application/pdf',
          body: { attachmentId: 'att1', size: 100 },
        },
        {
          mimeType: 'multipart/related',
          body: {},
          parts: [
            {
              filename: 'file2.png',
              mimeType: 'image/png',
              body: { attachmentId: 'att2', size: 200 },
            },
          ],
        },
      ],
    };
    const result = extractAttachments(payload, 'msg2');
    expect(result).toHaveLength(2);
    expect(result[0].filename).toBe('file1.pdf');
    expect(result[1].filename).toBe('file2.png');
    expect(result[1].messageId).toBe('msg2');
  });

  it('defaults mimeType to application/octet-stream when missing', () => {
    const payload = {
      filename: 'unknown.bin',
      body: { attachmentId: 'att99', size: 50 },
    };
    const result = extractAttachments(payload, 'msg3');
    expect(result[0].mimeType).toBe('application/octet-stream');
  });

  it('defaults size to 0 when body.size is missing', () => {
    const payload = {
      filename: 'file.txt',
      mimeType: 'text/plain',
      body: { attachmentId: 'att5' },
    };
    const result = extractAttachments(payload, 'msg4');
    expect(result[0].size).toBe(0);
  });
});

// ─── buildEmailRaw ────────────────────────────────────────────────────────

describe('buildEmailRaw', () => {
  it('returns a non-empty base64url-encoded string', () => {
    const raw = buildEmailRaw({ to: 'to@example.com', subject: 'Test', body: 'Hello' });
    expect(typeof raw).toBe('string');
    expect(raw.length).toBeGreaterThan(0);
    expect(raw).not.toContain('+');
    expect(raw).not.toContain('/');
    expect(raw).not.toContain('=');
  });

  it('decoded output contains correct To and Subject headers', () => {
    const raw = buildEmailRaw({ to: 'bob@example.com', subject: 'My Subject', body: 'Body text' });
    const decoded = fromBase64url(raw);
    expect(decoded).toContain('To: bob@example.com');
    expect(decoded).toContain('Subject: My Subject');
  });

  it('includes MIME-Version header', () => {
    const raw = buildEmailRaw({ to: 'a@b.com', subject: 'Hi', body: 'Hey' });
    expect(fromBase64url(raw)).toContain('MIME-Version: 1.0');
  });

  it('uses Content-Type text/plain for emails without attachments', () => {
    const raw = buildEmailRaw({ to: 'a@b.com', subject: 'Hi', body: 'Hey' });
    expect(fromBase64url(raw)).toContain('Content-Type: text/plain; charset=UTF-8');
  });

  it('includes the body text', () => {
    const raw = buildEmailRaw({ to: 'a@b.com', subject: 'Hi', body: 'My email body' });
    expect(fromBase64url(raw)).toContain('My email body');
  });

  it('adds Re: prefix for replies when subject does not already have it', () => {
    const raw = buildEmailRaw({ to: 'a@b.com', subject: 'Original', body: 'reply', isReply: true });
    expect(fromBase64url(raw)).toContain('Subject: Re: Original');
  });

  it('does not double-prefix Re: when subject already starts with re:', () => {
    const raw = buildEmailRaw({ to: 'a@b.com', subject: 'Re: Already', body: 'reply', isReply: true });
    expect(fromBase64url(raw)).toContain('Subject: Re: Already');
    expect(fromBase64url(raw)).not.toContain('Re: Re:');
  });

  it('includes In-Reply-To header when provided', () => {
    const raw = buildEmailRaw({
      to: 'a@b.com',
      subject: 'Hi',
      body: 'Body',
      inReplyTo: '<msgid@example.com>',
    });
    expect(fromBase64url(raw)).toContain('In-Reply-To: <msgid@example.com>');
  });

  it('includes References header when provided', () => {
    const raw = buildEmailRaw({
      to: 'a@b.com',
      subject: 'Hi',
      body: 'Body',
      inReplyTo: '<msg1@example.com>',
      references: '<msg0@example.com> <msg1@example.com>',
    });
    const decoded = fromBase64url(raw);
    expect(decoded).toContain('References: <msg0@example.com> <msg1@example.com>');
  });

  it('prevents CRLF injection in To header (no separate Bcc header line created)', () => {
    const raw = buildEmailRaw({
      to: 'evil@example.com\r\nBcc: victim@example.com',
      subject: 'Hi',
      body: 'Body',
    });
    const decoded = fromBase64url(raw);
    // sanitizeHeader replaces \r\n with a space — no actual CRLF in the output
    expect(decoded).not.toContain('\r\nBcc:');
    // No standalone Bcc: header line
    expect(decoded).not.toMatch(/^Bcc:/m);
  });

  it('prevents CRLF injection in Subject header (no separate injected header line created)', () => {
    const raw = buildEmailRaw({
      to: 'a@b.com',
      subject: 'Legit\r\nX-Injected: header',
      body: 'Body',
    });
    const decoded = fromBase64url(raw);
    // sanitizeHeader replaces \r\n with a space — X-Injected is not a real header
    expect(decoded).not.toContain('\r\nX-Injected:');
    expect(decoded).not.toMatch(/^X-Injected:/m);
  });

  it('uses multipart/mixed content-type when attachments are present', () => {
    const raw = buildEmailRaw({
      to: 'a@b.com',
      subject: 'With Attachment',
      body: 'See attached',
      attachments: [{ name: 'file.txt', type: 'text/plain', data: btoa('content') }],
    });
    const decoded = fromBase64url(raw);
    expect(decoded).toContain('Content-Type: multipart/mixed');
    expect(decoded).toContain('Content-Transfer-Encoding: base64');
    expect(decoded).toContain('filename="file.txt"');
  });
});

// ─── buildReplyRaw ────────────────────────────────────────────────────────

describe('buildReplyRaw', () => {
  it('is a deprecated wrapper that behaves like buildEmailRaw with isReply=true', () => {
    const raw = buildReplyRaw({ to: 'a@b.com', subject: 'Topic', body: 'Reply text' });
    expect(fromBase64url(raw)).toContain('Subject: Re: Topic');
  });
});

// ─── getRefreshToken ──────────────────────────────────────────────────────

describe('getRefreshToken', () => {
  const makeRequest = (cookieHeader) => ({
    headers: { get: (name) => (name === 'cookie' ? cookieHeader : null) },
  });

  it('extracts token from gmail_refresh_token cookie', () => {
    const req = makeRequest('gmail_refresh_token=mytoken123; other=val');
    expect(getRefreshToken(req)).toBe('mytoken123');
  });

  it('URL-decodes the token value', () => {
    const req = makeRequest('gmail_refresh_token=tok%2Fwith%2Fslashes');
    expect(getRefreshToken(req)).toBe('tok/with/slashes');
  });

  it('falls back to GMAIL_REFRESH_TOKEN env var when cookie is absent', () => {
    const original = process.env.GMAIL_REFRESH_TOKEN;
    process.env.GMAIL_REFRESH_TOKEN = 'env-token';
    const req = makeRequest('');
    expect(getRefreshToken(req)).toBe('env-token');
    process.env.GMAIL_REFRESH_TOKEN = original;
  });

  it('returns null when no cookie and no env var', () => {
    const original = process.env.GMAIL_REFRESH_TOKEN;
    delete process.env.GMAIL_REFRESH_TOKEN;
    const req = makeRequest('');
    expect(getRefreshToken(req)).toBeNull();
    process.env.GMAIL_REFRESH_TOKEN = original;
  });
});

// ─── getSalesRefreshToken ─────────────────────────────────────────────────

describe('getSalesRefreshToken', () => {
  const makeRequest = (cookieHeader) => ({
    headers: { get: (name) => (name === 'cookie' ? cookieHeader : null) },
  });

  it('extracts token from sales_gmail_refresh_token cookie', () => {
    const req = makeRequest('sales_gmail_refresh_token=salestoken; other=val');
    expect(getSalesRefreshToken(req)).toBe('salestoken');
  });

  it('URL-decodes the token value', () => {
    const req = makeRequest('sales_gmail_refresh_token=tok%2Fwith%2Fslashes');
    expect(getSalesRefreshToken(req)).toBe('tok/with/slashes');
  });

  it('returns null when cookie is absent', () => {
    const req = makeRequest('');
    expect(getSalesRefreshToken(req)).toBeNull();
  });

  it('does not fall back to GMAIL_REFRESH_TOKEN env var', () => {
    const original = process.env.GMAIL_REFRESH_TOKEN;
    process.env.GMAIL_REFRESH_TOKEN = 'env-token';
    const req = makeRequest('');
    expect(getSalesRefreshToken(req)).toBeNull();
    process.env.GMAIL_REFRESH_TOKEN = original;
  });
});
