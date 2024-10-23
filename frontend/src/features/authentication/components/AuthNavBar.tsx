import React from "react";
import PeerPrepLogo from "../../../components/PeerPrepLogo";

const AuthNavBar: React.FC = () => {
  return (
    <nav className="bg-off-white w-full p-4 flex items-center justify-between relative">
      {/* Logo or Brand (Left-aligned) */}
      <div className="flex-none">
        <PeerPrepLogo />
      </div>
    </nav>
  );
};

export default AuthNavBar;
