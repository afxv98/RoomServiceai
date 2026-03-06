/**
 * @jest-environment node
 */
import { hashPassword, verifyPassword } from '../../lib/password';

describe('hashPassword', () => {
  it('returns a string in salt:hash format', async () => {
    const result = await hashPassword('mypassword');
    expect(result).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
  });

  it('produces different hashes for the same password (random salt)', async () => {
    const hash1 = await hashPassword('samepassword');
    const hash2 = await hashPassword('samepassword');
    expect(hash1).not.toBe(hash2);
  });

  it('produces a 32-character hex salt (16 bytes)', async () => {
    const result = await hashPassword('test');
    const [salt] = result.split(':');
    expect(salt).toHaveLength(32);
  });

  it('produces a 128-character hex hash (64 bytes)', async () => {
    const result = await hashPassword('test');
    const [, hash] = result.split(':');
    expect(hash).toHaveLength(128);
  });

  it('handles empty string password', async () => {
    const result = await hashPassword('');
    expect(result).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
  });

  it('handles very long passwords', async () => {
    const longPassword = 'a'.repeat(1000);
    const result = await hashPassword(longPassword);
    expect(result).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
  });

  it('handles special characters in password', async () => {
    const result = await hashPassword('p@$$w0rd!#%^&*()');
    expect(result).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
  });

  it('handles unicode passwords', async () => {
    const result = await hashPassword('pässwörð😀');
    expect(result).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
  });
});

describe('verifyPassword', () => {
  it('returns true for correct password', async () => {
    const stored = await hashPassword('correctpassword');
    expect(await verifyPassword('correctpassword', stored)).toBe(true);
  });

  it('returns false for wrong password', async () => {
    const stored = await hashPassword('correctpassword');
    expect(await verifyPassword('wrongpassword', stored)).toBe(false);
  });

  it('returns false when checking empty string against a real password', async () => {
    const stored = await hashPassword('correctpassword');
    expect(await verifyPassword('', stored)).toBe(false);
  });

  it('returns true when correct empty string matches a hashed empty string', async () => {
    const stored = await hashPassword('');
    expect(await verifyPassword('', stored)).toBe(true);
  });

  it('verifies password with special characters', async () => {
    const password = 'p@$$w0rd!#%^&*()';
    const stored = await hashPassword(password);
    expect(await verifyPassword(password, stored)).toBe(true);
    expect(await verifyPassword('wrong', stored)).toBe(false);
  });

  it('is case-sensitive', async () => {
    const stored = await hashPassword('Password');
    expect(await verifyPassword('password', stored)).toBe(false);
    expect(await verifyPassword('PASSWORD', stored)).toBe(false);
    expect(await verifyPassword('Password', stored)).toBe(true);
  });

  it('each hashed copy of same password verifies correctly', async () => {
    const stored1 = await hashPassword('hello');
    const stored2 = await hashPassword('hello');
    expect(stored1).not.toBe(stored2); // different salts
    expect(await verifyPassword('hello', stored1)).toBe(true);
    expect(await verifyPassword('hello', stored2)).toBe(true);
  });

  it('rejects on malformed stored hash (no colon separator)', async () => {
    // Without a colon, storedHash will be undefined → Buffer.from throws
    await expect(verifyPassword('test', 'nocolonseparator')).rejects.toThrow();
  });

  it('handles very long passwords correctly', async () => {
    const longPassword = 'a'.repeat(1000);
    const stored = await hashPassword(longPassword);
    expect(await verifyPassword(longPassword, stored)).toBe(true);
    expect(await verifyPassword('a'.repeat(999), stored)).toBe(false);
  });
});
