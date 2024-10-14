import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import IsConnected from "./IsConnected";
import ProfileButton from "./ProfileButton";
import { User } from "../types/User";
import useRetrieveUser from "../hooks/useRetrieveUser";

const NavBar: React.FC = () => {
  const location = useLocation();
  const [user, setUser] = useState<User | undefined>(undefined);
  useRetrieveUser(setUser);
  return (
    <nav className="bg-off-white w-full p-4 flex items-center justify-between relative">
      {/* Logo or Brand (Left-aligned) */}
      <div className="flex-none">
        <img
          src="/src/assets/logo.svg"
          alt="PeerPrep logo"
          className="h-16 w-64"
        />
      </div>

      {/* IsConnected component (Center-aligned, independent of flex) */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <IsConnected isConnected={false} />
      </div>

      {/* ProfileButton or Enter as Admin/User buttons (Right-aligned) */}
      <div className="flex-none">
        {location.pathname === "/" ? (
          <div className="flex space-x-8 text-2xl">
            <Link to="/register">
              <button className="bg-black text-off-white rounded-[25px] p-4 whitespace-nowrap">
                Register
              </button>
            </Link>
            <Link to="/login">
              <button className="bg-yellow text-black rounded-[25px] p-4 whitespace-nowrap">
                Login
              </button>
            </Link>
          </div>
        ) : (
          <Link to="/profile">
            <ProfileButton userId={user ? user.id : ""}/>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
