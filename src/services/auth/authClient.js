import { createAuthClient } from 'better-auth/react';

// Better Auth is self-hosted in this project (netlify/functions/auth.js,
// mounted at /api/auth/* via the netlify.toml redirect), so the client
// talks to the same origin the app is served from by default. Override
// with VITE_BETTER_AUTH_URL only if the API is ever split onto a
// different domain than the frontend.
const baseURL =
  import.meta.env.VITE_BETTER_AUTH_URL ||
  `${window.location.origin}/api/auth`;

export const authClient = createAuthClient({ baseURL });
