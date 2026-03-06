/**
 * @jest-environment node
 */

// jest.mock() is hoisted before all requires by babel-jest
jest.mock('@/lib/prisma', () => ({
  prisma: {
    hotelUser: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@/lib/password', () => ({
  verifyPassword: jest.fn(),
}));

// Variables populated in beforeAll after env vars are set and modules re-required
let POST, DELETE, prisma, verifyPassword;

beforeAll(() => {
  // Set env vars before the route module loads so its ADMIN constant captures them
  process.env.ADMIN_EMAIL = 'admin@example.com';
  process.env.ADMIN_PASSWORD = 'securepassword';

  // Reset the module registry so the route re-initializes with the env vars above.
  // jest.mock() factories are still registered and will be used for fresh requires.
  jest.resetModules();

  const route = require('../../../app/api/auth/admin-session/route');
  POST = route.POST;
  DELETE = route.DELETE;

  // Capture the same mock instances the route now uses
  prisma = require('@/lib/prisma').prisma;
  verifyPassword = require('@/lib/password').verifyPassword;
});

function makeRequest(body) {
  return {
    json: jest.fn().mockResolvedValue(body),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/auth/admin-session', () => {
  describe('admin login', () => {
    it('returns 200 and sets admin_session cookie on valid admin credentials', async () => {
      const req = makeRequest({
        email: 'admin@example.com',
        password: 'securepassword',
        userType: 'admin',
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ ok: true, userType: 'admin' });
      const setCookie = res.headers.get('set-cookie');
      expect(setCookie).toContain('admin_session=1');
      expect(setCookie).toContain('HttpOnly');
    });

    it('returns 401 for wrong admin password', async () => {
      const req = makeRequest({
        email: 'admin@example.com',
        password: 'wrongpassword',
        userType: 'admin',
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('Invalid credentials');
    });

    it('returns 401 for wrong admin email', async () => {
      const req = makeRequest({
        email: 'other@example.com',
        password: 'securepassword',
        userType: 'admin',
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });
  });

  describe('hotel user login', () => {
    it('returns 200 when hotel user credentials are valid', async () => {
      prisma.hotelUser.findUnique.mockResolvedValue({
        id: 1,
        email: 'hotel@example.com',
        passwordHash: 'hash',
      });
      verifyPassword.mockResolvedValue(true);

      const req = makeRequest({
        email: 'hotel@example.com',
        password: 'hotelpass',
        userType: 'hotel',
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ ok: true, userType: 'hotel' });
    });

    it('returns 401 when hotel user is not found', async () => {
      prisma.hotelUser.findUnique.mockResolvedValue(null);

      const req = makeRequest({
        email: 'notfound@example.com',
        password: 'pass',
        userType: 'hotel',
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it('returns 401 when hotel user password is wrong', async () => {
      prisma.hotelUser.findUnique.mockResolvedValue({
        id: 2,
        email: 'hotel@example.com',
        passwordHash: 'hash',
      });
      verifyPassword.mockResolvedValue(false);

      const req = makeRequest({
        email: 'hotel@example.com',
        password: 'wrongpass',
        userType: 'hotel',
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it('returns 503 when database throws', async () => {
      prisma.hotelUser.findUnique.mockRejectedValue(new Error('DB error'));

      const req = makeRequest({
        email: 'hotel@example.com',
        password: 'pass',
        userType: 'hotel',
      });
      const res = await POST(req);
      expect(res.status).toBe(503);
    });
  });

  describe('unknown userType', () => {
    it('returns 401 for unknown userType', async () => {
      const req = makeRequest({ email: 'a@b.com', password: 'pass', userType: 'unknown' });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it('returns 401 when userType is omitted', async () => {
      const req = makeRequest({ email: 'a@b.com', password: 'pass' });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });
  });

  describe('invalid request body', () => {
    it('returns 400 for malformed JSON', async () => {
      const req = { json: jest.fn().mockRejectedValue(new SyntaxError('bad json')) };
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Invalid request body');
    });
  });
});

describe('DELETE /api/auth/admin-session', () => {
  it('returns 200 and clears the admin_session cookie', async () => {
    const res = await DELETE();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ ok: true });
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toContain('admin_session=');
    expect(setCookie).toContain('Max-Age=0');
  });
});
