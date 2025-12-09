import { useState, useEffect } from 'react';
import authService from '../services/auth/authServive.js';
import SuperAdminProfilePage from './SuperAdminProfilePage.jsx';
import UserProfilePage from './UserProfilePage.jsx';
import GuestProfilePage from './GuestProfilePage.jsx';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    }
    checkUser();

    // Listen for auth state changes
    const { data: authListener } = authService.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show guest page
  if (!user) {
    return <GuestProfilePage />;
  }

  // Check if user is super-admin - try multiple possible locations
  const isSuperAdmin =
    user.raw_app_meta_data?.role === 'super-admin' ||
    user.app_metadata?.role === 'super-admin' ||
    user.user_metadata?.role === 'super-admin';

  // Render appropriate profile page based on role
  return isSuperAdmin ? (
    <SuperAdminProfilePage user={user} />
  ) : (
    <UserProfilePage user={user} />
  );
}
