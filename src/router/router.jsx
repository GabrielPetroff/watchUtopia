import { createBrowserRouter } from 'react-router';

import Layout from '../components/layout/Layout.jsx';
import AboutUsPage from '../components/pages/AboutUsPage.jsx';
import CartPage from '../components/pages/CartPage.jsx';
import CheckoutPage from '../components/pages/CheckoutPage.jsx';
import ContactUsPage from '../components/pages/ContactUsPage.jsx';
import HomePage from '../components/pages/HomePage.jsx';
import LoginPage from '../components/pages/LoginPage.jsx';
import NotFound from '../components/pages/NotFoundPage.jsx';
import ProductEditPage from '../components/pages/ProductEditPage.jsx';
import ProductsPage from '../components/pages/ProductsPage.jsx';
import RegisterPage from '../components/pages/RegisterPage.jsx';
import ShippingDeliveryPage from '../components/pages/ShippingDeliveryPage.jsx';
import WatchDetailsPage from '../components/pages/WatchDetailsPage.jsx';
import WishlistPage from '../components/pages/WishlistPage.jsx';
import ProfilePage from '../components/profile/ProfilePage.jsx';

import ProtectedRoute from './ProtectedRoute.jsx';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/products',
        element: <ProductsPage />,
      },
      {
        path: '/about',
        element: <AboutUsPage />,
      },
      {
        path: '/contact',
        element: <ContactUsPage />,
      },
      {
        path: '/shipping',
        element: <ShippingDeliveryPage />,
      },
      {
        path: '/watch/:id',
        element: <WatchDetailsPage />,
      },
      {
        path: '/wishlist',
        element: (
          <ProtectedRoute requireAuth={true}>
            <WishlistPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/cart',
        element: (
          <ProtectedRoute requireAuth={true}>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/checkout',
        element: (
          <ProtectedRoute requireAuth={true}>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/product/:id/edit',
        element: (
          <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <ProductEditPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default routes;
