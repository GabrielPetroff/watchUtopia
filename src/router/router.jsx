import { createBrowserRouter } from 'react-router';
import HomePage from '../components/HomePage.jsx';
import ProfilePage from '../components/ProfilePage.jsx';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: 'profiles',
    element: <ProfilePage />,
  },
]);

export default routes;
