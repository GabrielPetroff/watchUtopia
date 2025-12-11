import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router';
import authService from '../../services/auth/authServive.js';
import {
  ChevronDown,
  ChevronRight,
  User,
  UserCheck,
} from 'lucide-react';

export default function Layout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

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

  const brandsArray = [
    { brand: 'Longines', linkTo: '/LonginesPage' },
    { brand: 'Rolex', linkTo: '/RolexPage' },
    { brand: 'Breitling', linkTo: '/BreitlingPage' },
    { brand: 'Vacheron Constantin', linkTo: '/VacheronConstantinPage' },
    { brand: 'Baume & Mercier', linkTo: '/BaumeMercierPage' },
    { brand: 'Tissot', linkTo: '/TissotPage' },
    { brand: 'Oris', linkTo: '/OrisPage' },
    { brand: 'Hamilton', linkTo: '/HamiltonPage' },
    { brand: 'Mido', linkTo: '/MidoPage' },
    { brand: 'Breguet', linkTo: '/BreguetPage' },
    { brand: 'Omega', linkTo: '/OmegaPage' },
    { brand: 'Junghans', linkTo: '/JunghansPage' },
    { brand: 'Nomos', linkTo: '/NomosPage' },
    { brand: 'Jaeger LeCoultre', linkTo: '/JaegerLeCoultrePage' },
    { brand: 'Audemars Piguet', linkTo: '/AudemarsPiguetPage' },
    { brand: 'Patek Philippe', linkTo: '/PatekPhilippePage' },
  ];

  const BrandsSection = () => (
    <li className="w-full">
      <div className="flex flex-col">
        <button
          onClick={() => toggleSection('brands')}
          className="flex items-center justify-between w-full py-2 border-b border-gray-700 hover:text-gray-300 transition-colors"
        >
          <h3 className="uppercase text-left font-semibold">Brands</h3>
          <ChevronDown
            className={`w-6 h-6 transition-transform duration-300 ${
              activeSection === 'brands' ? 'rotate-180' : ''
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            activeSection === 'brands'
              ? 'max-h-[600px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="grid grid-cols-2 gap-3 py-3">
            {brandsArray.map((item, index) => (
              <Link
                key={index}
                to={item.linkTo}
                className="text-sm hover:text-gray-300 transition-colors"
              >
                {item.brand}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </li>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <header className="sticky top-0 bg-white shadow-md w-full z-50">
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

              {user && (
                <>
                  <li className="relative group">
                    <Link
                      to="/wishlist"
                      className="relative text-[#161818] hover:text-indigo-600 font-medium transition-colors duration-300"
                    >
                      Wishlist
                      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                  <li className="relative group">
                    <Link
                      to="/cart"
                      className="relative text-[#161818] hover:text-indigo-600 font-medium transition-colors duration-300"
                    >
                      Cart
                      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                  <li className="relative group">
                    <Link
                      to="/orders"
                      className="relative text-[#161818] hover:text-indigo-600 font-medium transition-colors duration-300"
                    >
                      Orders
                      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                </>
              )}

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

              <li className="relative group">
                <Link
                  to="/profile"
                  className="relative text-[#161818] hover:text-indigo-600 font-medium transition-colors duration-300 flex items-center gap-2"
                  title={user ? 'My Profile' : 'Profile'}
                >
                  {user ? (
                    <UserCheck className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>

              {user ? (
                <li className="relative group">
                  <button
                    onClick={handleLogout}
                    className="relative text-[#161818] hover:text-indigo-600 font-medium transition-colors duration-300"
                  >
                    Logout
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </li>
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

      {/* <footer class="bg-neutral-primary-soft rounded-base shadow-xs  m-4">
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
      </footer> */}

      <footer className="w-full bg-[#161818] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Mobile/Tablet View - Accordion Style */}
          <div className="lg:hidden">
            <ul className="flex flex-col space-y-1">
              <BrandsSection />

              {/* Quick Links */}
              <li className="w-full">
                <div className="flex flex-col">
                  <button
                    onClick={() => toggleSection('quick-links')}
                    className="flex items-center justify-between w-full py-2 border-b border-gray-700 hover:text-gray-300 transition-colors"
                  >
                    <h3 className="uppercase text-left font-semibold">
                      Quick Links
                    </h3>
                    <ChevronDown
                      className={`w-6 h-6 transition-transform duration-300 ${
                        activeSection === 'quick-links' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeSection === 'quick-links'
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="flex flex-col items-start py-3 space-y-2">
                      <Link
                        to="/"
                        className="hover:text-gray-300 transition-colors text-sm"
                      >
                        Home
                      </Link>
                      <Link
                        to="/products"
                        className="hover:text-gray-300 transition-colors text-sm"
                      >
                        All Watches
                      </Link>
                      <Link
                        to="/about"
                        className="hover:text-gray-300 transition-colors text-sm"
                      >
                        About Us
                      </Link>
                      {user && (
                        <>
                          <Link
                            to="/wishlist"
                            className="hover:text-gray-300 transition-colors text-sm"
                          >
                            My Wishlist
                          </Link>
                          <Link
                            to="/cart"
                            className="hover:text-gray-300 transition-colors text-sm"
                          >
                            Shopping Cart
                          </Link>
                          <Link
                            to="/orders"
                            className="hover:text-gray-300 transition-colors text-sm"
                          >
                            My Orders
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>

              {/* Customer Service */}
              <li className="w-full">
                <div className="flex flex-col">
                  <button
                    onClick={() => toggleSection('customer-service')}
                    className="flex items-center justify-between w-full py-2 border-b border-gray-700 hover:text-gray-300 transition-colors"
                  >
                    <h3 className="uppercase text-left font-semibold">
                      Customer Service
                    </h3>
                    <ChevronDown
                      className={`w-6 h-6 transition-transform duration-300 ${
                        activeSection === 'customer-service' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeSection === 'customer-service'
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="flex flex-col items-start py-3 space-y-2">
                      <Link
                        to="/contact"
                        className="hover:text-gray-300 transition-colors text-sm"
                      >
                        Contact Us
                      </Link>
                      <p className="text-sm text-gray-300">Shipping & Delivery</p>
                      <p className="text-sm text-gray-300">Returns & Refunds</p>
                      <p className="text-sm text-gray-300">Warranty Information</p>
                      <p className="text-sm text-gray-300">Authenticity Guarantee</p>
                    </div>
                  </div>
                </div>
              </li>

              {/* Payment Methods */}
              <li className="w-full pt-6">
                <h3 className="uppercase font-semibold mb-3 text-sm">
                  We Accept
                </h3>
                <div className="flex items-center gap-3 flex-wrap pb-6 border-b border-gray-700">
                  <div className="text-xs bg-gray-700 px-3 py-1.5 rounded">
                    VISA
                  </div>
                  <div className="text-xs bg-gray-700 px-3 py-1.5 rounded">
                    Mastercard
                  </div>
                  <div className="text-xs bg-gray-700 px-3 py-1.5 rounded">
                    Apple Pay
                  </div>
                  <div className="text-xs bg-gray-700 px-3 py-1.5 rounded">
                    Google Pay
                  </div>
                </div>
              </li>
            </ul>

            {/* Copyright Mobile */}
            <div className="pt-6 text-center">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} Watch Utopia. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Your premier destination for luxury timepieces
              </p>
            </div>
          </div>

          {/* Desktop View - Grid Layout */}
          <div className="hidden lg:block">
            <div className="grid lg:grid-cols-4 gap-12 mb-8">
              {/* About Column */}
              <div>
                <h3 className="uppercase font-semibold mb-4 text-sm">
                  About Watch Utopia
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  Your premier destination for luxury timepieces and exceptional
                  craftsmanship. We offer authentic watches from the world's
                  most prestigious brands.
                </p>
                <Link
                  to="/about"
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Learn more about us →
                </Link>
              </div>

              {/* Quick Links Column */}
              <div>
                <h3 className="uppercase font-semibold mb-4 text-sm">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/"
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products"
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      All Watches
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  {user && (
                    <>
                      <li>
                        <Link
                          to="/wishlist"
                          className="text-sm text-gray-300 hover:text-white transition-colors"
                        >
                          My Wishlist
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/cart"
                          className="text-sm text-gray-300 hover:text-white transition-colors"
                        >
                          Shopping Cart
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/orders"
                          className="text-sm text-gray-300 hover:text-white transition-colors"
                        >
                          My Orders
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Customer Service Column */}
              <div>
                <h3 className="uppercase font-semibold mb-4 text-sm">
                  Customer Service
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/contact"
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li className="text-sm text-gray-300">Shipping & Delivery</li>
                  <li className="text-sm text-gray-300">Returns & Refunds</li>
                  <li className="text-sm text-gray-300">Warranty Information</li>
                  <li className="text-sm text-gray-300">Authenticity Guarantee</li>
                  <li className="text-sm text-gray-300">Payment Options</li>
                </ul>
              </div>

              {/* Featured Brands Column */}
              <div>
                <h3 className="uppercase font-semibold mb-4 text-sm">
                  Featured Brands
                </h3>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {brandsArray.slice(0, 8).map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.linkTo}
                        className="text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        {item.brand}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1 mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>View All Brands</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="pt-8 border-t border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Copyright */}
                <div className="text-sm text-gray-400">
                  <p>
                    © {new Date().getFullYear()} Watch Utopia. All rights reserved.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Your premier destination for luxury timepieces
                  </p>
                </div>

                {/* Payment Methods */}
                <div>
                  <p className="text-xs text-gray-400 mb-2 text-center">
                    We Accept
                  </p>
                  <div className="flex gap-2">
                    <div className="text-xs bg-gray-700 px-3 py-1.5 rounded">
                      VISA
                    </div>
                    <div className="text-xs bg-gray-700 px-3 py-1.5 rounded">
                      Mastercard
                    </div>
                    <div className="text-xs bg-gray-700 px-3 py-1.5 rounded">
                      Apple Pay
                    </div>
                    <div className="text-xs bg-gray-700 px-3 py-1.5 rounded">
                      Google Pay
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
