import React from "react";
import {useState} from "react";
import AdminNavBar from "../components/AdminNavBar.tsx";
import EditQuestionModal from "../components/EditQuestionModal.tsx";

const QuestionPage: React.FC = () => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  return (
    <div className="w-screen h-screen flex flex-col">
      <AdminNavBar />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">Question</div>
        <div className="flex flex-col">editor</div>
      </div>
      {/* For testing purposes */}
      <button
        onClick = {openEditModal}
      >Edit question
      </button>
      <EditQuestionModal isOpen={isEditModalOpen} onClose={closeEditModal} />
    </div>
  );
};

export default QuestionPage;
