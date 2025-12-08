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
        path: '/watch/:id',
        element: <WatchDetailsPage />,
      },
      {
        path: '/wishlist',
        element: <WishlistPage />,
      },
      {
        path: '/orders',
        element: <OrdersPage />,
      },
    ],
  },

  {
    path: 'profiles',
    element: <ProfilePage />,
  },
]);

export default routes;
