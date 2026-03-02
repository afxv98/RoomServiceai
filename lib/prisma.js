import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma';

const globalForPrisma = globalThis;

function createPrismaClient() {
  // Strip sslmode from the URL so pg-connection-string doesn't override our ssl config.
  // pg-connection-string currently treats sslmode=require as verify-full (rejectUnauthorized: true).
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.delete('sslmode');
  const pool = new Pool({ connectionString: url.toString(), ssl: { rejectUnauthorized: false } });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
