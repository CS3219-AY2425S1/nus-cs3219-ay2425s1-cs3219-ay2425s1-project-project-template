import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import { Avatar, AvatarIcon } from "@nextui-org/react";
import NextLink from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import { SettingButton, NotificationButton } from "@/components/navbar-buttons";
import { Logo } from "@/components/icons";
import { fontFun } from "@/config/fonts";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export const NavbarLoggedIn = async () => {
  const user = await currentUser();

  return (
    <NextUINavbar maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full gap-10" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center" href="/">
            <Logo />
          </NextLink>
        </NavbarBrand>
        <div
          className={`${fontFun.variable} text-black dark:text-white flex items-center`}
          style={{
            fontFamily: "var(--font-fun)",
            fontSize: "20px",
            margin: "10px",
          }}
        >
          Hello {user?.username} 👋🏻,
        </div>
      </NavbarContent>

      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="flex items-center justify-center gap-5">
          <div className="hidden sm:flex">
            <SettingButton />
            <NotificationButton />
            <ThemeSwitch className="ml-2.5" />
          </div>

          <UserButton />
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
