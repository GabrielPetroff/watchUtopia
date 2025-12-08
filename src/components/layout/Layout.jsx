import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router';
import authService from '../../services/auth/authServive.js';
import {
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  ChevronRight,
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

  const shopItems = ['Watches', 'New Releases', 'Straps', 'Accessories'];
  const aboutItems = [
    'Shipping',
    'Financing',
    'Returns & Refunds',
    'Warranty',
    'Account Login',
  ];
  const customerCareItems = ['Option A', 'Option B', 'Option C'];

  const AccordionSection = ({ title, items, section }) => (
    <li className="w-full">
      <div className="flex flex-col">
        <button
          onClick={() => toggleSection(section)}
          className="flex items-center justify-between w-full py-2 border-b border-gray-700 hover:text-gray-300 transition-colors"
        >
          <h3 className="uppercase text-left font-semibold">{title}</h3>
          <ChevronDown
            className={`w-6 h-6 transition-transform duration-300 ${
              activeSection === section ? 'rotate-180' : ''
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            activeSection === section
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col items-start py-3 space-y-2">
            {items.map((item, index) => (
              <p
                key={index}
                className="hover:text-gray-300 transition-colors cursor-pointer text-sm"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </li>
  );

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile/Tablet View - Accordion Style */}
          <div className="lg:hidden">
            <ul className="flex flex-col space-y-1">
              <AccordionSection title="Shop" items={shopItems} section="shop" />
              <AccordionSection
                title="About Us"
                items={aboutItems}
                section="about"
              />
              <AccordionSection
                title="Customer Care"
                items={customerCareItems}
                section="care"
              />
              <BrandsSection />

              {/* Newsletter */}
              <li className="w-full pt-6">
                <div className="flex flex-col space-y-3">
                  <h3 className="uppercase font-semibold">Subscribe</h3>
                  <p className="text-sm text-gray-300">
                    Sign up to our monthly newsletter
                  </p>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-transparent border border-gray-600 py-3 px-4 focus:outline-none focus:border-white transition-colors text-sm"
                      type="email"
                      placeholder="Email address"
                    />
                    <button className="px-6 py-3 uppercase border border-gray-600 hover:bg-white hover:text-black transition-colors text-sm">
                      Sign up
                    </button>
                  </div>
                </div>
              </li>

              {/* Social Media */}
              <li className="w-full pt-6">
                <div className="flex flex-col space-y-3">
                  <h3 className="font-semibold uppercase">Follow us</h3>
                  <div className="flex gap-3 pb-4 border-b border-gray-700">
                    <Facebook className="w-8 h-8 hover:scale-110 transition-transform cursor-pointer" />
                    <Twitter className="w-8 h-8 hover:scale-110 transition-transform cursor-pointer" />
                    <Instagram className="w-8 h-8 hover:scale-110 transition-transform cursor-pointer" />
                    <Youtube className="w-8 h-8 hover:scale-110 transition-transform cursor-pointer" />
                    <Linkedin className="w-8 h-8 hover:scale-110 transition-transform cursor-pointer" />
                    <Mail className="w-8 h-8 hover:scale-110 transition-transform cursor-pointer" />
                  </div>
                </div>
              </li>

              {/* Links */}
              <li className="w-full pt-4">
                <div className="flex items-center text-sm">
                  <button className="pr-5 border-r border-gray-600 hover:text-gray-300 transition-colors">
                    Contact us
                  </button>
                  <button className="pl-5 hover:text-gray-300 transition-colors">
                    Account / Login
                  </button>
                </div>
              </li>

              {/* Payment Methods */}
              <li className="w-full pt-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-xs bg-gray-700 px-3 py-1 rounded">
                    VISA
                  </div>
                  <div className="text-xs bg-gray-700 px-3 py-1 rounded">
                    Mastercard
                  </div>
                  <div className="text-xs bg-gray-700 px-3 py-1 rounded">
                    Apple Pay
                  </div>
                  <div className="text-xs bg-gray-700 px-3 py-1 rounded">
                    Google Pay
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Desktop View - Grid Layout */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-8">
            {/* Shop Column */}
            <div>
              <h3 className="uppercase font-semibold mb-4 text-sm">Shop</h3>
              <ul className="space-y-2">
                {shopItems.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* About Us Column */}
            <div>
              <h3 className="uppercase font-semibold mb-4 text-sm">About Us</h3>
              <ul className="space-y-2">
                {aboutItems.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care Column */}
            <div>
              <h3 className="uppercase font-semibold mb-4 text-sm">
                Customer Care
              </h3>
              <ul className="space-y-2">
                {customerCareItems.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Brands Column */}
            <div>
              <h3 className="uppercase font-semibold mb-4 text-sm">Brands</h3>
              <div className="flex items-center gap-1 mb-3 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer">
                <span>Shop All Brands</span>
                <ChevronRight className="w-3 h-3" />
              </div>
              <p className="text-xs text-gray-400 mb-2">Featured Brands</p>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {brandsArray.map((item, index) => (
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
            </div>

            {/* Newsletter Column */}
            <div>
              <h3 className="uppercase font-semibold mb-4 text-sm">
                Subscribe
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Sign up to our monthly newsletter
              </p>
              <div className="flex flex-col gap-2 mb-6">
                <input
                  className="bg-transparent border border-gray-600 py-2 px-3 focus:outline-none focus:border-white transition-colors text-sm"
                  type="email"
                  placeholder="Email address"
                />
                <button className="px-4 py-2 uppercase border border-gray-600 hover:bg-white hover:text-black transition-colors text-sm">
                  Sign up
                </button>
              </div>

              {/* Social Media */}
              <h3 className="font-semibold uppercase mb-3 text-sm">
                Follow us
              </h3>
              <div className="flex gap-3 mb-6">
                <Facebook className="w-7 h-7 hover:scale-110 transition-transform cursor-pointer" />
                <Twitter className="w-7 h-7 hover:scale-110 transition-transform cursor-pointer" />
                <Instagram className="w-7 h-7 hover:scale-110 transition-transform cursor-pointer" />
                <Youtube className="w-7 h-7 hover:scale-110 transition-transform cursor-pointer" />
                <Linkedin className="w-7 h-7 hover:scale-110 transition-transform cursor-pointer" />
                <Mail className="w-7 h-7 hover:scale-110 transition-transform cursor-pointer" />
              </div>

              {/* Links */}
              <div className="flex flex-col gap-2 text-sm mb-4">
                <button className="text-left hover:text-gray-300 transition-colors">
                  Contact us
                </button>
                <button className="text-left hover:text-gray-300 transition-colors">
                  Account / Login
                </button>
              </div>

              {/* Payment Methods */}
              <div className="flex flex-wrap gap-2">
                <div className="text-xs bg-gray-700 px-2 py-1 rounded">
                  VISA
                </div>
                <div className="text-xs bg-gray-700 px-2 py-1 rounded">
                  Mastercard
                </div>
                <div className="text-xs bg-gray-700 px-2 py-1 rounded">
                  Apple Pay
                </div>
                <div className="text-xs bg-gray-700 px-2 py-1 rounded">
                  Google Pay
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
