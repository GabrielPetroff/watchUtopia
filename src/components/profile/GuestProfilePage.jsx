import { Link } from 'react-router';
import { UserX, LogIn, UserPlus } from 'lucide-react';

export default function GuestProfilePage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#F0F8FF' }}
    >
      <div className="max-w-md w-full">
        <div
          className="rounded-lg shadow-md p-8 text-center"
          style={{ backgroundColor: '#F0F8FF' }}
        >
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 mb-6">
            <UserX className="h-10 w-10 text-indigo-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Profile Access Required
          </h2>

          <p className="text-gray-600 mb-8">
            Please log in or create an account to access your profile and view
            your orders.
          </p>

          <div className="space-y-4">
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Log In
            </Link>

            <Link
              to="/register"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-indigo-600 text-base font-medium rounded-lg text-indigo-600  hover:bg-indigo-50 transition-colors"
              style={{ backgroundColor: '#F0F8FF' }}
            >
              <UserPlus className="w-5 h-5" />
              Create Account
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Already browsing? Continue shopping:
            </p>
            <Link
              to="/products"
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Browse Products →
            </Link>
          </div>
        </div>

        {/* Benefits Section */}
        <div
          className="mt-8  rounded-lg shadow-md p-6"
          style={{ backgroundColor: '#F0F8FF' }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Why create an account?
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Track your orders in real-time</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Save items to your wishlist</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Faster checkout process</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>View your complete order history</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Exclusive deals and promotions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
