import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton.tsx";
import AddQuestionModal from "./AddQuestionModal.tsx";

interface AdminNavBarProps {
  setQuestions: React.Dispatch<React.SetStateAction<never[]>>;
}

const AdminNavBar: React.FC<AdminNavBarProps> = ({ setQuestions }) => {
  const location = useLocation();

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  useEffect(() => console.log(setQuestions), []);

  return (
    <nav className="bg-off-white w-full p-4 flex items-center justify-between">
      {/* Logo or Brand */}
      <div className="container flex justify-start">
        <img
          src="/src/assets/logo.svg"
          alt="PeerPrep logo"
          className="h-16 w-64"
        />
      </div>
      {/* Conditionally render extra div based on location */}
      {location.pathname == "/question" ||
        (location.pathname == "/dashboard" && (
          <div className="container text-off-white">
            <button
              onClick={() => openAddModal()}
              className="bg-green rounded-[25px] p-4 text-2xl hover:bg-emerald-700"
            >
              Add question
            </button>
            {isAddModalOpen && <AddQuestionModal setQuestions={setQuestions} onClose={closeAddModal} />}
          </div>
        ))}
      {/* Profile button */}
      <div>
        <ProfileButton />
      </div>
    </nav>
  );
};

export default AdminNavBar;
