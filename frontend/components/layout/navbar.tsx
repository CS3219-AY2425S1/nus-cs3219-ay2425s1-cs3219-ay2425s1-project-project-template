'use client'

import * as React from 'react'

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import Image from 'next/image'
import Link from 'next/link'
import { LogOutIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'

export function NavBar() {
    return (
        <div className="flex justify-between border-b-[1px]">
            <Link href="/" legacyBehavior passHref>
                <div className={navigationMenuTriggerStyle()}>
                    <Image src="/logo.svg" alt="Logo" width={30} height={30} />
                </div>
            </Link>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/questions" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Questions</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/sessions" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Sessions</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/account" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Account</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div
                className={navigationMenuTriggerStyle()}
                onClick={async () => {
                    await signOut({ callbackUrl: '/auth' })
                }}
            >
                <LogOutIcon />
            </div>
        </div>
    )
}
