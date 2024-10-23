import { Link } from "react-router-dom";
import { MatchButton } from "../features/matching";
import ProfileButton from "../features/profile/components/ProfileButton";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import MatchingModal from "../features/matching/components/MatchingModal";
import PeerPrepLogo from "./PeerPrepLogo";

const UserNavBar = () => {
  const { user } = useUser();
  const [isUserMatchingModalOpen, setIsUserMatchingModalOpen] = useState(false);

  const openMatchingModal = () => setIsUserMatchingModalOpen(true);
  const closeMatchingModal = () => setIsUserMatchingModalOpen(false);

  return (
    <nav className="bg-off-white w-full p-4 flex items-center justify-between">
      {/* Logo or Brand */}
      <div className="container flex justify-start">
        <PeerPrepLogo />
      </div>

      {/* Match button and profile for authenticated users */}
      <div className="container text-off-white">
        <MatchButton onClick={() => openMatchingModal()} />
      </div>
      {isUserMatchingModalOpen && (
        <MatchingModal closeMatchingModal={closeMatchingModal} />
      )}
      <div className="flex-none">
        <Link to="/profile">
          <ProfileButton currUser={user} />
        </Link>
      </div>
    </nav>
  );
};

export default UserNavBar;

// import { useLocation, Link } from "react-router-dom";
// import { MatchButton } from "../features/matching";
// import ProfileButton from "../features/profile/components/ProfileButton";
// import { useUser } from "../context/UserContext";
// import { useState } from "react";
// import MatchingModal from "../features/matching/components/MatchingModal";
// import PeerPrepLogo from "./PeerPrepLogo";

// const NavBar = () => {
//   const location = useLocation();
//   const { user } = useUser();
//   const [isUserMatchingModalOpen, setIsUserMatchingModalOpen] = useState(false);

//   const openMatchingModal = () => setIsUserMatchingModalOpen(true);
//   const closeMatchingModal = () => setIsUserMatchingModalOpen(false);

//   return (
//     <nav className="bg-off-white w-full p-4 flex items-center justify-between">
//       {/* Logo or Brand (Left-aligned) */}
//       <div className="container flex justify-start">
//         <PeerPrepLogo />
//       </div>

//       {/* ProfileButton or Enter as Admin/User buttons (Right-aligned) */}
//       <div className="flex-none">
//         {location.pathname === "/" ? (
//           <div className="flex space-x-8 text-2xl">
//             <Link to="/register">
//               <button className="bg-black text-off-white rounded-[25px] p-4 whitespace-nowrap">
//                 Register
//               </button>
//             </Link>
//             <Link to="/login">
//               <button className="bg-yellow text-black rounded-[25px] p-4 whitespace-nowrap">
//                 Login
//               </button>
//             </Link>
//           </div>
//         ) : (
//           <div>
//             {location.pathname === "/dashboardForUsers" && (
//               // <div className="absolute left-1/2 transform -translate-x-1/2">
//               <div className="container text-off-white">
//                 <MatchButton onClick={() => openMatchingModal()} />
//               </div>
//             )}
//             {isUserMatchingModalOpen && (
//               <MatchingModal closeMatchingModal={closeMatchingModal} />
//             )}
//             <div className="flex-none">
//               <Link to="/profile">
//                 <ProfileButton currUser={user} />
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default NavBar;
