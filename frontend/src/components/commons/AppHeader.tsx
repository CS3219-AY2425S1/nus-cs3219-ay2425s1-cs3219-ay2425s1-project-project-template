"use client";

import React from "react";
import { UserIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; // Adjust the path as per your project structure

const AppHeader: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex justify-between items-center">
      <div className="flex">
        <Link href="#" className="flex items-center space-x-2" prefetch={false}>
          <span className="text-xl font-bold">PeerPrep</span>
        </Link>
        <nav className="hidden md:flex space-x-4 px-5 items-center">
          <Link href="./sessions" className="hover:underline">
            Sessions
          </Link>
          <Link href="./questions" className="hover:underline">
            Questions
          </Link>
        </nav>
      </div>

      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400 hover:text-white transition-colors">
              <UserIcon className="w-6 h-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 mr-2">
            <DropdownMenuItem>
              <UserIcon className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
