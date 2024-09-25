"use client"

import React, { useState } from 'react';
import { UserIcon, SettingsIcon, LogOutIcon } from 'lucide-react';
import './AppHeader.css';

const AppHeader: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="container">

        <div className="left-section">
          <h1 className="title">PeerPrep</h1>
          <nav className="nav-buttons">
            <button className="user-button">Sessions</button>
            <button className="user-button">Questions</button>
          </nav>
        </div>

        <div className="right-section">
          <button
            className="user-button"
            onClick={toggleDropdown}
          >
            <UserIcon className="w-6 h-6" />
          </button>
          {isDropdownOpen && (
            <div className="dropdown">
              <a
                href="#"
                className="dropdown-item"
                onClick={closeDropdown}
              >
                <UserIcon className="w-4 h-4 inline-block mr-2" /> Profile
              </a>
              <a
                href="#"
                className="dropdown-item"
                onClick={closeDropdown}
              >
                <SettingsIcon className="w-4 h-4 inline-block mr-2" /> Settings
              </a>
              <a
                href="#"
                className="dropdown-item"
                onClick={closeDropdown}
              >
                <LogOutIcon className="w-4 h-4 inline-block mr-2" /> Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
