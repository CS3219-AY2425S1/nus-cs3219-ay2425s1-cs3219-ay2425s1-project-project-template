import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
      <div className="h-screen flex flex-col max-w-6xl mx-auto py-10 ">
        <header className="mx-5">
          <Image
          className="dark:invert"
            src="/icons/logo-full.png"
            alt="Next.js logo"
            width={128}
            height={128}
          />
        </header>
        
        <main className="relative mx-5 flex space-x-20 items-center flex-1">
          <div>
            <h1 className="text-6xl font-hairline leading-snug font-albert">Real Time Collaboration</h1>
            <p className="text-2xl font-hairline font-albert">easier than ever</p>
            <Link href="/login">
            <button
              className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-20 rounded mt-10"
            >
              Sign in
            </button>
            </Link>

          </div>
          <Image
            src="/icons/landing_icon.png"
            alt="Landing page icon"
            width={512}
            height={512}
            priority
          />
        </main>
      </div>  
  );
}
