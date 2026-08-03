import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

// Reuse the client across warm Lambda invocations instead of opening a new
// connection per request (Netlify Functions run on a Lambda-style runtime).
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

export const prisma = globalThis.__prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}
