import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 fixed w-full top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          PeerPrep
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white">
            Problems
          </Link>
          <Link href="/match" className="text-gray-300 hover:text-white">
            Match
          </Link>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}
