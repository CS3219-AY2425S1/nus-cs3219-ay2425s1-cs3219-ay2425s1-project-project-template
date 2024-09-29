import NextLink from "next/link";
import { ReactNode } from "react";

interface NavLinkProps {
  children: ReactNode;
  href: string;
  isActive: boolean;
}
export default function NavLink({ href, isActive, children }: NavLinkProps) {
  let className;

  if (isActive) {
    className = "py-1 px-2 bg-white rounded-md text-black";
  } else {
    className = "text-white";
  }

  return (
    <NextLink className={className} href={href}>
      {children}
    </NextLink>
  );
}
