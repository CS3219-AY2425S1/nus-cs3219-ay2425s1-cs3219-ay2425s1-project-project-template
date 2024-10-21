"use client";
import { useTheme } from "next-themes";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Button } from "@nextui-org/react";
import { usePathname } from "next/navigation";

import BoxIcon from "./boxicons";

import { siteConfig } from "@/config/site";

export const Sidebar = () => {
  const { theme } = useTheme();
  const currentPath = usePathname();

  return (
    <div className="h-fit flex flex-col fixed w-fit pr-4 relative">
      <Listbox
        variant="flat"
        aria-label="Listbox menu with sections"
        className="w-fit "
      >
        {siteConfig.navItems.map((item) => (
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
      >
        Sign out
      </Button>
    </div>
  );
};
