import reactLogo from '@/assets/react.svg';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <nav className='col-span-12 bg-white shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <img className='h-8 w-auto' src={reactLogo} alt='Logo' />
            </div>
            <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              <a
                href='#'
                className='border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
              >
                Problems
              </a>
              <a
                href='#'
                className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
              >
                Discuss
              </a>
            </div>
          </div>
          <div className='hidden sm:ml-6 sm:flex sm:items-center'>
            <Button variant={"secondary"}>Sign In</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.displayName = 'Navbar';
