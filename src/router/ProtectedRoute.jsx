import { useState, useEffect } from 'react';
import { Navigate } from 'react-router';
import authService from '../services/auth/authServive.js';
import { checkUserRole } from '../utils/authUtils.js';

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#F0F8FF' }}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  // Check if admin role is required
  if (requireAdmin) {
    const isSuperAdmin = checkUserRole(user, 'super-admin');
    if (!isSuperAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
