import { NavBar } from '@/components/layout/navbar'
import { inter } from '@/fonts'
import '@/styles/globals.css'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <NavBar />
            <div className={`${inter.className} mx-10`}>{children}</div>
        </>
    )
}
