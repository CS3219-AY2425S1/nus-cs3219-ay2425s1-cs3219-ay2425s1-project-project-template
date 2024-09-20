'use client';
// components/navbar.tsx
import Link from 'next/link';
import classnames from "classnames";
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const currentPath = usePathname();
  const routes = [
    { label: "Explore", href:"/explore" },
    { label: "Codespace", href:"/codespace" },
    { label: "Dashboard", href:"/dashboard" }
  ]
  return (
    <nav className="bg-violet-800 p-3 w-screen h-18 fixed">
      <div className="mx-auto flex justify-between items-center">
        
        <div className="text-white flex text-3xl font-extrabold">
            <div className='text-4xl mx-8 '>{'</>'}</div>
            <Link href="/">peerprep.</Link>
        </div>
        <ul className="flex justify-end w-4/5 text-lg">
          {routes.map(route => 
              <Link
                    key={route.label} 
                    className={classnames({
                        'font-bold': route.href === currentPath,
                        'font-medium': route.href !== currentPath,
                        'hover:text-zinc-400 text-white transition-colors mx-4': true
                    })} 
                    href={route.href}>
                        {route.label}
              </Link>)}
        </ul>
        <div className='flex w-auto justify-between'>
            <button className='font-black bg-yellow-500 mt-1 h-10 px-4 rounded-lg mx-4'>
                Practice {/* button to call API and brings out matching component*/}
            </button>
            <div className='w-12 h-12 rounded-full bg-white mx-4'></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
