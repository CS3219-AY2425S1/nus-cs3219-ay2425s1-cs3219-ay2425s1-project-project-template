import React from "react";
import {useState} from "react";
import DeleteQuestionModal from "./DeleteQuestionModal";

const EditQuestionModal: React.FC<{ isOpen: boolean; onClose: () => void}> = ({ isOpen, onClose}) => {
  /* Placeholders */
  const oldDifficulty = "Easy";
  const oldTopic = "Array";
  const oldTitle = "Two sum";
  const oldDetails = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  function onDelete() {
    alert("Deleted");
    closeDeleteModal();
    onClose();
  }

  function onSubmit() {
    const selectElement = document.getElementById('difficulty') as HTMLSelectElement | null;
    const newSelectedValue = selectElement ? selectElement.value : '';
    
    const topicElement = document.getElementById("topic") as HTMLInputElement | null;
    const newTopicValue = topicElement ? topicElement.value : "";
    
    const titleElement = document.getElementById("title") as HTMLInputElement | null;
    const newTitleValue = titleElement ? titleElement.value : "";
    
    const detailsElement = document.getElementById("details") as HTMLInputElement | null;
    const newDetailsValue = detailsElement ? detailsElement.value : "";

    if (newSelectedValue == "" || newTopicValue == "" || newTitleValue == "" || newDetailsValue == "") {
      //alert(newSelectedValue + newTopicValue + newTitleValue + newDetailsValue);
      
      document.getElementById("emptyMessage")?.classList.remove("hidden");
      document.getElementById("emptyMessage")?.classList.add('visible');
    } else {
      //alert(newSelectedValue + newTopicValue + newTitleValue + newDetailsValue);
      document.getElementById("emptyMessage")?.classList.remove("visible");
      document.getElementById("emptyMessage")?.classList.add('hidden');
    
    }
  }

  if (isOpen && location.pathname == "/question") {
    return (
      <>
        <div id="editQuestionModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 text-black">
          <div className="bg-white rounded-lg p-4 w-3/5 h-9/10 fade-in modal-context z-50">
            {/* Header */}
            <div className="justify-start">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-2xl font-bold">Edit Question</h2>
                <button 
                onClick={onClose} 
                id="submit"
                className="px-2 rounded-lg hover:bg-gray-200"
              >
                X
              </button>
              </div>
              <div>
                <p className="text-sm">Editing "{oldTitle}" Question.</p>
                <button className="text-sm text-indigo-800 hover:bg-gray-200 rounded-lg">Click here to view the original question for reference.</button>
              </div>
            </div>
            
            <div className="mt-3"></div>
            {/* Difficulty */}
            <div>
              <label className="font-semibold">Difficulty Level</label>
              <div className="relative mt-1 shadow-md">
                <select 
                  name="difficulty" id="difficulty" defaultValue={oldDifficulty}
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-opacity-50 focus:ring-black sm:text-sm sm:leading-6"
                >
                  <option value="" disabled selected hidden>Choose a difficulty level</option>
                  <option className="text-green ">Easy</option>
                  <option className="text-orange-500">Medium</option>
                  <option className="text-red-700">Hard</option>
                </select>
              </div>
            </div>

            {/* Topic */}
            <div className="mt-2">
              <label className="font-semibold">Topic</label>
              <div className="relative mt-1 shadow-md">
                <input 
                  type="text" name="topic" id="topic" defaultValue={oldTopic}
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-opacity-50 focus:ring-black sm:text-sm sm:leading-6"
                ></input>
              </div>
            </div>

            {/* Question Title */}
            <div className="mt-2">
              <label className="font-semibold">Question Title</label>
              <div className="relative mt-1 shadow-md">
                <input 
                  type="text" name="title" id="title" defaultValue={oldTitle}
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-opacity-50 focus:ring-black sm:text-sm sm:leading-6"
                ></input>
              </div>
            </div>

            {/* Question details */}
            <div className="mt-2">
              <label className="font-semibold">Question details</label>
              <div className="relative mt-1 shadow-md">
                <textarea
                  name="details" id="details" defaultValue={oldDetails}
                  rows={3}
                  className="block w-full resize-none rounded-md border-0 px-2 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-opacity-50 focus:ring-black sm:text-sm sm:leading-6"
                ></textarea>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6">
              <text  id="emptyMessage" className="flex justify-center text-red-500 hidden">* Please fill in all the empty fields. *</text>
              <div className="flex justify-evenly mt-2">
              <button 
                  onClick={openDeleteModal} 
                  id="submit"
                  className="bg-black bg-opacity-80 rounded-lg px-4 py-1.5 text-white text-lg hover:bg-gray-600"
                >
                  Delete Question
                </button>
                <DeleteQuestionModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onDelete={onDelete} />
                <button 
                  onClick={onSubmit} 
                  id="submit"
                  className="bg-green rounded-lg px-4 py-1.5 text-white text-lg hover:bg-emerald-400"
                >
                  Submit
                </button>
                <button 
                  onClick={onClose} 
                  id="submit"
                  className="bg-red-500 rounded-lg px-4 py-1.5 text-white text-lg hover:bg-red-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
};

export default EditQuestionModal;