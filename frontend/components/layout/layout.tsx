'use client'

import { NavBar } from '@/components/layout/navbar'
import React from 'react'
import { inter } from '@/styles/fonts'
import { useSession } from 'next-auth/react'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { data: session } = useSession()

    return (
        <>
            {session ? (
                <>
                    <NavBar />
                    <div className={`${inter.className} mx-10 my-6`}>{children}</div>
                </>
            ) : (
                children
            )}
        </>
    )
}
