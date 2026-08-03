import { auth } from './_lib/betterAuth.js';

// Netlify Functions v2 (Web-standard Request/Response) — Better Auth's
// handler already speaks fetch-API Request/Response natively, so no
// Node req/res bridging (toNodeHandler) is needed here. Mounts every
// route Better Auth supports (sign-up, sign-in, sign-out, session, etc.)
// under /api/auth/*.
export default async (request) => {
  return auth.handler(request);
};

export const config = {
  path: '/api/auth/*',
};
