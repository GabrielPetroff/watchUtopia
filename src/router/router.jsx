import { createBrowserRouter } from 'react-router';
import HomePage from '../components/HomePage.jsx';
import ProfilePage from '../components/ProfilePage.jsx';
import Layout from '../components/layout/Layout.jsx';
import RegisterPage from '../components/RegisterPage.jsx';
import LoginPage from '../components/LoginPage.jsx';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
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
    ],
  },

  {
    path: 'profiles',
    element: <ProfilePage />,
  },
]);

export default routes;
