'use client'
// components/navbar.tsx
import Link from 'next/link'
import classnames from 'classnames'
import { usePathname } from 'next/navigation'

const Navbar: React.FC = () => {
    const currentPath = usePathname()
    const routes = [
        { label: 'Explore', href: '/explore' },
        { label: 'Codespace', href: '/codespace' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Problems', href: '/problems' },
    ]
    return (
        <nav className="bg-violet-800 p-2 w-screen fixed">
            <div className="mx-auto flex justify-between items-center 2xl:w-3/5">
                <div className="text-white flex gap-4 text-xl ml-6 font-extrabold">
                    <div className="text-xl">{'</>'}</div>
                    <Link href="/">peerprep.</Link>
                </div>
                <ul className="flex justify-end w-4/5 text-sm">
                    {routes.map((route) => (
                        <Link
                            key={route.label}
                            className={classnames({
                                'font-bold': route.href === currentPath,
                                'font-medium': route.href !== currentPath,
                                'hover:text-zinc-400 text-white transition-colors mx-4':
                                    true,
                            })}
                            href={route.href}
                        >
                            {route.label}
                        </Link>
                    ))}
                </ul>
                <div className="flex w-auto justify-between items-center">
                    <button className="font-black bg-yellow-500 h-8 px-4 text-sm rounded-lg mx-4">
                        Practice{' '}
                        {/* button to call API and brings out matching component*/}
                    </button>
                    <div className="w-10 h-10 rounded-full bg-white mx-4"></div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
