import { createBrowserRouter } from 'react-router';
import HomePage from '../components/HomePage.jsx';
import ProfilePage from '../components/ProfilePage.jsx';
import Layout from '../components/layout/Layout.jsx';
import RegisterPage from '../components/RegisterPage.jsx';
import LoginPage from '../components/LoginPage.jsx';
import NotFound from '../components/NotFoundPage.jsx';
import WatchDetailsPage from '../components/WatchDetailsPage.jsx';
import WishlistPage from '../components/WishlistPage.jsx';
import OrdersPage from '../components/OrdersPage.jsx';
import ProductsPage from '../components/ProductsPage.jsx';
import AboutUsPage from '../components/AboutUsPage.jsx';
import CartPage from '../components/CartPage.jsx';
import CheckoutPage from '../components/CheckoutPage.jsx';
import ProductEditPage from '../components/ProductEditPage.jsx';
import ContactUsPage from '../components/ContactUsPage.jsx';
import ShippingDeliveryPage from '../components/ShippingDeliveryPage.jsx';
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
        path: '/orders',
        element: (
          <ProtectedRoute requireAuth={true}>
            <OrdersPage />
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
