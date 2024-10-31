"use client";

import { getAuthStatus, logout } from "@/api/user";
import { AuthStatus } from "@/types/user";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { CgProfile } from "react-icons/cg";
import { IoIosLogIn, IoIosLogOut, IoMdSearch } from "react-icons/io";
import { MdAdminPanelSettings, MdDashboard, MdHomeFilled } from "react-icons/md";

interface SidebarMenuItemProps {
  menuLabel: string;
  menuIcon: IconType;
  linksTo: string;
  authStatus: AuthStatus | null;
}

const iconSize = 30;

const willShowItem = (authStatus: AuthStatus) => (item: SidebarMenuItemProps) => {
  if (item.authStatus === AuthStatus.ADMIN) return authStatus === AuthStatus.ADMIN;
  if (item.authStatus === AuthStatus.UNAUTHENTICATED) return authStatus === AuthStatus.UNAUTHENTICATED;
  if (item.authStatus === AuthStatus.AUTHENTICATED) return authStatus !== AuthStatus.UNAUTHENTICATED;
  return true;
};

const sidebarItems: SidebarMenuItemProps[] = [
  {
    menuLabel: "Home",
    menuIcon: MdHomeFilled,
    linksTo: "/",
    authStatus: null
  },
  {
    menuLabel: "Dashboard",
    menuIcon: MdDashboard,
    linksTo: "/dashboard",
    authStatus: AuthStatus.AUTHENTICATED
  },
  {
    menuLabel: "Admin",
    menuIcon: MdAdminPanelSettings,
    linksTo: "/admin",
    authStatus: AuthStatus.ADMIN
  },
  {
    menuLabel: "Account",
    menuIcon: CgProfile,
    linksTo: "/user/me",
    authStatus: AuthStatus.AUTHENTICATED
  },
  {
    menuLabel: "Match",
    menuIcon: IoMdSearch,
    linksTo: "/match",
    authStatus: AuthStatus.AUTHENTICATED
  },
];

const loginSidebarItem: SidebarMenuItemProps = {
  menuLabel: "Login",
  menuIcon: IoIosLogIn,
  linksTo: "/login",
  authStatus: AuthStatus.UNAUTHENTICATED
}

const SidebarItem = (item: SidebarMenuItemProps) => {
  return <Link className="group grid text-primary-500 p-2 hover:bg-primary-700" href={item.linksTo} key={item.menuLabel}>
    <item.menuIcon size={iconSize} className="mx-auto"/>
    <p className="text-center text-[12px]">{item.menuLabel}</p>
  </Link>;
}

const Sidebar = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [sidebarItemsToShow, setSidebarItemsToShow] = useState<JSX.Element[]>([]);
  useEffect(() => {
    const status = getAuthStatus();
    setAuthStatus(status);
    const sidebarItemsToShow = sidebarItems.filter(willShowItem(status)).map(SidebarItem);
    setSidebarItemsToShow(sidebarItemsToShow);
  }, []);

  return <nav className="bg-primary-900 w-20 flex flex-col gap-2 py-4 h-screen">
    {sidebarItemsToShow}

    {authStatus === AuthStatus.AUTHENTICATED ?
      <button className="group grid text-primary-500 p-2 hover:bg-primary-700 w-full mt-auto" onClick={logout}>
        <IoIosLogOut size={iconSize} className="group-hover:text-secondary mx-auto"/>
        <p className="text-center text-[12px]">Logout</p>
      </button> :
      <SidebarItem {...loginSidebarItem}/>
    }
  </nav>
};

export default Sidebar;