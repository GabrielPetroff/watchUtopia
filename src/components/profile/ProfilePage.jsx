import { useAuth } from '../../contexts/AuthContext.jsx';

import { isSuperAdmin } from '../../utils/authUtils.js';

import GuestProfilePage from './GuestProfilePage.jsx';
import SuperAdminProfilePage from './SuperAdminProfilePage.jsx';
import UserProfilePage from './UserProfilePage.jsx';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#F0F8FF' }}
      >
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

  // Check if user is super-admin using centralized utility
  const isAdmin = isSuperAdmin(user);

  // Render appropriate profile page based on role
  return isAdmin ? (
    <SuperAdminProfilePage user={user} />
  ) : (
    <UserProfilePage user={user} />
  );
}
