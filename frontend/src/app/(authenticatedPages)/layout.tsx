"use client";

import { ReactNode, useState } from "react";
import { Sidebar, Menu, MenuItem, MenuItemStyles } from "react-pro-sidebar";
import { MdHomeFilled } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoMdSearch } from "react-icons/io";
import { IconType } from "react-icons";
import { RiLogoutBoxLine } from "react-icons/ri";

interface SidebarMenuItemProps {
  menuLabel: string;
  menuIcon: IconType;
}

const SidebarMenuItem = ({
  menuLabel,
  menuIcon: MenuIcon,
}: SidebarMenuItemProps) => {
  return <MenuItem icon={<MenuIcon size={20} />}>{menuLabel}</MenuItem>;
};

const sidebarItems: SidebarMenuItemProps[] = [
  {
    menuLabel: "Home",
    menuIcon: MdHomeFilled,
  },
  {
    menuLabel: "Profile",
    menuIcon: CgProfile,
  },
  {
    menuLabel: "Find Match",
    menuIcon: IoMdSearch,
  },
];

const menuItemStyles: MenuItemStyles = {
  root: {
    color: "#6679A4",
  },
};

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="flex h-full">
      <Sidebar
        className="h-full"
        collapsed={!isHovered}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        backgroundColor={"#171C28"}
      >
        <div className="h-full flex flex-col justify-between">
          <Menu menuItemStyles={menuItemStyles}>
            {sidebarItems.map((item, idx) => (
              <SidebarMenuItem
                key={idx}
                menuLabel={item["menuLabel"]}
                menuIcon={item["menuIcon"]}
              />
            ))}
          </Menu>
          <Menu
            menuItemStyles={menuItemStyles}
            rootStyles={{
              marginBottom: "60px",
            }}
          >
            <SidebarMenuItem menuLabel="Logout" menuIcon={RiLogoutBoxLine} />
          </Menu>
        </div>
      </Sidebar>
      {children}
    </div>
  );
};

export default AuthLayout;
