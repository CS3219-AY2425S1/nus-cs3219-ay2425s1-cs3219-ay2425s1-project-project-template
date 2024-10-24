import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import NextLink from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import { SettingButton, NotificationButton } from "@/components/navbar-buttons";
import { Logo } from "@/components/icons";
import { fontFun } from "@/config/fonts";
import { getSession, getUsername } from "@/auth/actions";
import { GreetingMessageHeader } from "./greetingmessageheader";

export const Navbar = async () => {
  const user = await getUsername();

  return (
    <NextUINavbar maxWidth="full" position="sticky">
      <NavbarContent className="basis-4/5 sm:basis-full gap-10" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center" href="/">
            <Logo />
          </NextLink>
        </NavbarBrand>
        <GreetingMessageHeader user={user || "User"} />
      </NavbarContent>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="flex items-center justify-center gap-5">
          <div className="hidden sm:flex">
            <SettingButton />
            <NotificationButton />
            <ThemeSwitch className="ml-2.5" />
          </div>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};

const HeaderText = async () => {};
