import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma.js';

// Self-hosted Better Auth instance (mounted at /api/auth/* by
// netlify/functions/auth.js), using the same Neon database/Prisma client
// as the rest of the API. Replaces Supabase's GoTrue.
//
// `role` mirrors the old Supabase `app_metadata.role` trust boundary:
// input:false means it can never be set via a client sign-up/update
// request, only by direct server-side code (e.g. a one-off script or SQL
// statement setting a user's role to 'super-admin').
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false,
      },
    },
  },
});
