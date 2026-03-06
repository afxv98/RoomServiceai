/**
 * @jest-environment node
 */
import { POST, DELETE } from '../../../app/api/auth/sales-session/route';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    salesRep: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@/lib/password', () => ({
  verifyPassword: jest.fn(),
}));

import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';

function makeRequest(body) {
  return {
    json: jest.fn().mockResolvedValue(body),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/auth/sales-session', () => {
  const validRep = {
    id: 42,
    name: 'Jane Sales',
    email: 'jane@example.com',
    passwordHash: 'hashvalue',
    isActive: true,
  };

  it('returns 200, rep data, and sets sales_session cookie on valid credentials', async () => {
    prisma.salesRep.findUnique.mockResolvedValue(validRep);
    verifyPassword.mockResolvedValue(true);

    const req = makeRequest({ email: 'Jane@Example.com', password: 'goodpass' });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.id).toBe(42);
    expect(data.name).toBe('Jane Sales');
    expect(data.email).toBe('jane@example.com');

    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toContain('sales_session=42');
    expect(setCookie).toContain('HttpOnly');
  });

  it('normalizes email to lowercase before lookup', async () => {
    prisma.salesRep.findUnique.mockResolvedValue(validRep);
    verifyPassword.mockResolvedValue(true);

    await POST(makeRequest({ email: 'JANE@EXAMPLE.COM', password: 'pass' }));

    expect(prisma.salesRep.findUnique).toHaveBeenCalledWith({
      where: { email: 'jane@example.com' },
    });
  });

  it('returns 401 when sales rep is not found', async () => {
    prisma.salesRep.findUnique.mockResolvedValue(null);

    const res = await POST(makeRequest({ email: 'nobody@example.com', password: 'pass' }));
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Invalid credentials');
  });

  it('returns 401 when rep is inactive', async () => {
    prisma.salesRep.findUnique.mockResolvedValue({ ...validRep, isActive: false });

    const res = await POST(makeRequest({ email: 'jane@example.com', password: 'goodpass' }));
    expect(res.status).toBe(401);
  });

  it('returns 401 when password is wrong', async () => {
    prisma.salesRep.findUnique.mockResolvedValue(validRep);
    verifyPassword.mockResolvedValue(false);

    const res = await POST(makeRequest({ email: 'jane@example.com', password: 'wrongpass' }));
    expect(res.status).toBe(401);
  });

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({ password: 'pass' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Email and password are required');
  });

  it('returns 400 when password is missing', async () => {
    const res = await POST(makeRequest({ email: 'jane@example.com' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Email and password are required');
  });

  it('returns 400 when both email and password are missing', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it('returns 503 when database throws', async () => {
    prisma.salesRep.findUnique.mockRejectedValue(new Error('Connection error'));

    const res = await POST(makeRequest({ email: 'jane@example.com', password: 'pass' }));
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toBe('Service unavailable');
  });
});

describe('DELETE /api/auth/sales-session', () => {
  it('returns 200 and clears the sales_session cookie', async () => {
    const res = await DELETE();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ ok: true });
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toContain('sales_session=');
    expect(setCookie).toContain('Max-Age=0');
  });
});
