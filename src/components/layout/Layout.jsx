import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router';
import authService from '../../services/auth/authServive.js';

export default function Layout() {
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

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <header className="bg-white shadow-md w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/">
            <img src="/WULogo.png" alt="site-logo" className="h-10" />
          </Link>

          <nav>
            <ul className="flex space-x-8 items-center">
              <li className="relative group">
                <Link
                  to="/"
                  className="relative text-[#161818] hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  Home
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>

              <li className="relative group">
                <Link
                  to="/products"
                  className="relative text-[#161818] hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  Products
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <ul className="absolute left-0 top-full mt-0.5 w-40 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity duration-300">
                  <li>
                    <Link
                      to="/products/brands"
                      className="block px-4 py-2 text-[#161818] hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      Brands
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products/watches"
                      className="block px-4 py-2 text-[#161818] hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      Watches
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products/straps"
                      className="block px-4 py-2 text-[#161818] hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      Straps
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products/accessories"
                      className="block px-4 py-2 text-[#161818] hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      Accessories
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="relative group">
                <Link
                  to="/about"
                  className="relative text-[#161818] hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  About
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>

              <li className="relative group">
                <Link
                  to="/contact"
                  className="relative text-[#161818] hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  Contact
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>

              {!user && (
                <li className="relative group">
                  <Link
                    to="/register"
                    className="relative text-[#161818] hover:text-indigo-600 font-medium transition-colors duration-300"
                  >
                    Register
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              )}

              {user ? (
                <>
                  <li className="text-[#161818] font-medium">
                    Welcome, {user.email}
                  </li>
                  <li className="relative group">
                    <button
                      onClick={handleLogout}
                      className="relative text-[#161818] hover:text-indigo-600 font-medium transition-colors duration-300"
                    >
                      Logout
                      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </li>
                </>
              ) : (
                <li className="relative group">
                  <Link
                    to="/login"
                    className="relative text-[#161818] hover:text-indigo-600 font-medium transition-colors duration-300"
                  >
                    Login
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <Outlet />

      <footer class="bg-neutral-primary-soft rounded-base shadow-xs  m-4">
        <div class="w-full mx-auto max-w-7xl p-4 md:flex md:items-center md:justify-between">
          <span class="text-sm text-body sm:text-center">
            © 2023{' '}
            <a href="https://flowbite.com/" class="hover:underline">
              Flowbite™
            </a>
            . All Rights Reserved.
          </span>
          <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-body sm:mt-0">
            <li>
              <a href="#" class="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#" class="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" class="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" class="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
