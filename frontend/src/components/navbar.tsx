// components/navbar.tsx
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-violet-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        
        <div className="text-white flex text-3xl font-extrabold">
            <div className='text-4xl mr-8 '>{'</>'}</div>
            <Link href="/">peerprep.</Link>
        </div>
        <ul className="flex justify-end w-4/5 text-lg">
          <li className='mx-4 font-bold'>
            <Link href="/">Explore</Link>
          </li>
          <li className='mx-4'>
            <Link href="/about">Codespace</Link>
          </li>
          <li className='mx-4'>
            <Link href="/contact">Dashboard</Link>
          </li>
        </ul>
        <div className='flex w-40 justify-between'>
            <button className='font-black bg-yellow-500 py-2 px-4 rounded-lg'>
                Practice
            </button>
            <div className='w-12 h-12 rounded-full bg-white'></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
