import { auth } from './betterAuth.js';

// Verifies the caller's Better Auth session server-side and derives the
// authenticated user id + role. This is the server-only equivalent of what
// Supabase RLS + app_metadata.role used to enforce implicitly -- every
// resource handler must call this instead of trusting a client-supplied
// userId, or ownership/role checks become bypassable (IDOR).

export class AuthError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.status = status;
  }
}

// event.headers (Netlify Functions v1/Lambda-style) is a plain object;
// Better Auth's server API expects a Fetch API Headers instance.
function toHeaders(event) {
  return new Headers(event.headers || {});
}

// Returns { userId, role, email } for a verified request, or throws
// AuthError(401) if there's no valid session.
export async function getAuthenticatedUser(event) {
  const session = await auth.api.getSession({ headers: toHeaders(event) });

  if (!session?.user) {
    throw new AuthError('Missing or invalid session', 401);
  }

  return {
    userId: session.user.id,
    role: session.user.role ?? 'user',
    email: session.user.email,
  };
}

// Throws AuthError(403) unless the verified user has the super-admin role.
// Call after getAuthenticatedUser() on any admin-only endpoint.
export function requireAdmin({ role }) {
  if (role !== 'super-admin') {
    throw new AuthError('Forbidden: super-admin role required', 403);
  }
}

export function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export function handleAuthError(error) {
  if (error instanceof AuthError) {
    return jsonResponse(error.status, { success: false, error: error.message });
  }
  console.error('Unhandled function error:', error);
  return jsonResponse(500, { success: false, error: 'Internal server error' });
}
