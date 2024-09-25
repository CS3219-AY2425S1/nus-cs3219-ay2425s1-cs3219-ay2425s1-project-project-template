import ProfileDropdown from '@/components/ProfileDropdown';
import AppHeader  from '../components/AppHeader';
import Sessions from './pages/dashboard'
import Questions from './pages/questions';


export default function Home() {
  return (
    <>
      <AppHeader/>
      {/* <Sessions/> */} 
      <Questions />
    </>
  );
}
