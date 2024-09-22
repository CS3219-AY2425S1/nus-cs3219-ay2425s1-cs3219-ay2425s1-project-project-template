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
    console.log(pathname)
    useEffect(() => {
        if (pathname == '/auth') {
            setIsAuth(true)
        }
    }, [])
    return (
        <>
            {isAuth ? (
                children
            ) : (
                <>
                    <NavBar />
                    <div className={`${inter.className} mx-10 my-6`}>{children}</div>
                </>
            )}
        </>
    )
}
