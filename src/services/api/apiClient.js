// Shared fetch helper for the Netlify Functions API (netlify/functions/*).
// The frontend and API are same-origin (see netlify.toml's /api/*
// redirect), so the browser attaches the Better Auth session cookie to
// every request automatically -- no manual token handling needed here.

async function apiFetch(path, options = {}) {
  try {
    const response = await fetch(path, {
      ...options,
      headers: {
        'content-type': 'application/json',
        ...options.headers,
      },
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: body?.error || body?.message || `Request failed (${response.status})`,
        message: body?.message,
      };
    }

    return body ?? { success: true };
  } catch (error) {
    console.error(`API request error (${path}):`, error);
    return { success: false, error: error.message || 'Network error' };
  }
}

export function apiGet(path) {
  return apiFetch(path, { method: 'GET' });
}

export function apiPost(path, data) {
  return apiFetch(path, { method: 'POST', body: JSON.stringify(data) });
}

export function apiPatch(path, data) {
  return apiFetch(path, { method: 'PATCH', body: JSON.stringify(data) });
}

export function apiDelete(path) {
  return apiFetch(path, { method: 'DELETE' });
}
