import { NavBar } from '@/components/layout/navbar'
import { inter } from '@/styles/fonts'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const [isAuth, setIsAuth] = useState(false)
    const pathname = usePathname()
    useEffect(() => {
        if (pathname == '/auth') {
            setIsAuth(true)
        }
    }, [])

    const navbarBlacklist = ['/code'] // Add paths here to hide the navbar
    const showNavBar = !navbarBlacklist.includes(pathname)

    return (
        <>
            {isAuth ? (
                children
            ) : (
                <>
                    {showNavBar && <NavBar />}
                    <div className={`${inter.className} mx-10 my-6`}>{children}</div>
                </>
            )}
        </>
    )
}
