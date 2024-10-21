"use client";
import { useTheme } from "next-themes";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Button } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";

import BoxIcon from "./boxicons";

import { siteConfig } from "@/config/site";
import { logout } from "@/app/api/auth/actions";

interface SidebarProps {
  isAdmin: boolean;
}

export const Sidebar = ({ isAdmin }: SidebarProps) => {
  const { theme } = useTheme();
  const currentPath = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="h-fit flex flex-col fixed w-fit pr-4 relative">
      <Listbox
        variant="flat"
        aria-label="Listbox menu with sections"
        className="w-fit "
      >
        {siteConfig.navItems
          .concat(isAdmin ? siteConfig.adminNavItems : [])
          .map((item: any) => (
            <ListboxItem
              key={item.label}
              startContent={
                <BoxIcon
                  name={item.icon}
                  color={
                    item.href === "/" && currentPath === "/"
                      ? "#3B82F6"
                      : currentPath.startsWith(item.href) && item.href !== "/"
                        ? "#3B82F6"
                        : theme === "dark"
                          ? "#d1d5db"
                          : "#4b5563"
                  }
                />
              }
              className="py-3 my-1"
              href={item.href}
            >
              <span
                className={
                  item.href === "/" && currentPath === "/"
                    ? "text-primary font-bold"
                    : currentPath.startsWith(item.href) && item.href !== "/"
                      ? "text-primary font-bold"
                      : "text-gray-600 dark:text-gray-300"
                }
              >
                {item.label}
              </span>
            </ListboxItem>
          ))}
      </Listbox>
      <Button
        className="fixed bottom-5 left-10 flex items-center justify-center bg-transparent text-danger"
        startContent={<BoxIcon name="bx-log-out" color="danger" />}
        onClick={handleLogout}
      >
        Sign out
      </Button>
    </div>
  );
};
