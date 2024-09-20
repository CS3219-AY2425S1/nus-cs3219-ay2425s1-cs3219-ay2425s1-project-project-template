import { MoonIcon, PersonIcon, SunIcon } from '@radix-ui/react-icons';
import { observer } from 'mobx-react';

import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouterLocation } from '@/lib/hooks';
import { ROUTES } from '@/lib/routes';
import { darkModeStore } from '@/stores/darkmode-store';

const NavBar = observer(() => {
  const { isLogin, isSignUp } = useRouterLocation();

  return (
    <header className='bg-secondary/80 border-border/40 sticky top-0 z-50 flex h-16 items-center gap-4 border px-4 backdrop-blur-md md:px-6'>
      <nav className='hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        <Logo className='text-md' />
        {!isLogin && !isSignUp && (
          <>
            <Button variant='ghost'>Start</Button>
            <Button variant='ghost'>Questions</Button>
          </>
        )}
        <div className='ml-auto flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
          <Tabs value={darkModeStore.mode} onValueChange={darkModeStore.toggle}>
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
            <Button variant='outline' asChild>
              <a href={ROUTES.SIGNUP}>Sign Up</a>
            </Button>
          )}
          {isSignUp && (
            <Button variant='outline' asChild>
              <a href={ROUTES.LOGIN}>Log In</a>
            </Button>
          )}
          {!isSignUp && !isLogin && (
            <Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
              <PersonIcon />
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
});

export default NavBar;
