import { SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { observer } from 'mobx-react';

import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { darkModeState } from '@/lib/state';
import { Button } from '../ui/button';
import { Logo } from '../common/logo';
import { useLocation } from 'react-router-dom';

const NavBar = observer(() => {
  const location = useLocation();
  let isSignUp = false;
  let isLogin = false;

  if (location.pathname === '/signup') {
    isSignUp = true;
    isLogin = false;
  } else if (location.pathname === '/login') {
    isLogin = true;
    isSignUp = false;
  }

  return (
    <header className='bg-secondary sticky top-0 flex h-16 items-center gap-4 px-4 md:px-6'>
      <nav className='hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        <Logo className='text-md' />
        <div className='ml-auto flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
          <Tabs value={darkModeState.mode} onValueChange={darkModeState.toggle}>
            <TabsList>
              <TabsTrigger value='light'>
                <SunIcon />
              </TabsTrigger>
              <TabsTrigger value='dark'>
                <MoonIcon />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {isLogin && (
            <Button variant='outline'>
              <a href='/signup'>Sign Up</a>
            </Button>
          )}
          {isSignUp && (
            <Button variant='outline'>
              <a href='/login'>Log In</a>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
});

export default NavBar;
