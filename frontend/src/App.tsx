import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import PrivateRoute from './components/PrivateRoute';
import AuthProvider from './hooks/AuthProvider';

const Admin = lazy(() => import('./pages/Admin'));
const FilterSelection = lazy(() => import('./pages/FilterSelection'));
const Landing = lazy(() => import('./pages/Landing'));
const Room = lazy(() => import('./pages/Room'));

const theme = createTheme({
  primaryColor: 'indigo',
  primaryShade: 6,
  colors: {
    slate: [
      '#F7FAFC',
      '#EDF2F7',
      '#E2E8F0',
      '#CBD5E0',
      '#A0AEC0',
      '#718096',
      '#4A5568',
      '#2D3748',
      '#1A202C',
      '#171923',
    ],
  },
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<></>}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route element={<PrivateRoute />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/select" element={<FilterSelection />} />
                <Route path="/room" element={<Room />} />
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
