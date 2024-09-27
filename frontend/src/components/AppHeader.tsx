"use client"

import React, { useState } from 'react';
import { UserIcon, SettingsIcon, LogOutIcon } from 'lucide-react';
import './AppHeader.css';
import Link from 'next/link';

const AppHeader: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (

    <header className="bg-primary text-primary-foreground py-4 px-6 flex justify-between items-center">
        <div className="left-section">
          <Link href="#" className="flex items-center space-x-2" prefetch={false}>
            <span className="text-xl font-bold">PeerPrep</span>
          </Link>
          <nav className="hidden md:flex space-x-4 px-5 items-center">
            <Link href="#" className="hover:underline">Sessions</Link>
            <Link href="#" className="hover:underline">Questions</Link>
          </nav>
        </div>

        <div className="right-section">
          <button className="user-button" onClick={toggleDropdown}>
            <UserIcon className="w-6 h-6" />
          </button>
          {isDropdownOpen && (
            <div className="dropdown">
              <a href="#" className="dropdown-item" onClick={closeDropdown}>
                <UserIcon className="w-4 h-4 inline-block mr-2 items-center" /> Profile
              </a>
              <a href="#" className="dropdown-item" onClick={closeDropdown}>
                <SettingsIcon className="w-4 h-4 inline-block mr-2" /> Settings
              </a>
              <a href="#" className="dropdown-item" onClick={closeDropdown}>
                <LogOutIcon className="w-4 h-4 inline-block mr-2" /> Logout
              </a>
            </div>
          )}
        </div>
    </header>
  );
};

export default AppHeader;