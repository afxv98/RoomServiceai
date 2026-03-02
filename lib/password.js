import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

const KEYLEN = 64;

/** Hash a plaintext password. Returns "<salt>:<hash>" (both hex-encoded). */
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scryptAsync(password, salt, KEYLEN);
  return `${salt}:${hash.toString('hex')}`;
}

/** Verify a plaintext password against a stored hash string. */
export async function verifyPassword(password, stored) {
  const [salt, storedHash] = stored.split(':');
  const hash = await scryptAsync(password, salt, KEYLEN);
  const storedBuf = Buffer.from(storedHash, 'hex');
  return timingSafeEqual(hash, storedBuf);
}
