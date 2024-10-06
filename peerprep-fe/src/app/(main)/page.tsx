'use client';
import LoggedIn from './components/LoggedIn';
import LandingPage from './components/LandingPage';
import { useAuth } from '@/hooks/useAuth';

// TODO: Replace with actual authentication logic
// change this to false to see landing page

export default function Home() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <LandingPage />;
  } else {
    return <LoggedIn />;
  }
}
