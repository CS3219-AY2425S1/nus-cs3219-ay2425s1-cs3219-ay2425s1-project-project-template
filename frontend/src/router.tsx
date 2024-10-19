import { createBrowserRouter } from 'react-router-dom';

import Admin from './pages/Admin';
import FilterSelection from './pages/FilterSelection';
import Landing from './pages/Landing';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '/select',
    element: <FilterSelection />,
  },
]);

export default router;
