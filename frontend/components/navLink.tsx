'use client'

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLinkProps {
    children: ReactNode;
    href: string;
}
export default function NavLink({ href, children }: NavLinkProps) {
    const path = usePathname();

    let className;
    if (path.startsWith(href) && path.length <= href.length) {
        className = 'py-1 px-2 bg-white rounded-md text-black';
    } else {
        className = 'text-white';
    }
    return (
        <Link href={href} className={className}>
            { children }
        </Link>
    )
}