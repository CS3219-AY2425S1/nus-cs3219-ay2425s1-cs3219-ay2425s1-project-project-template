import React from "react";


const DeleteQuestionModal: React.FC<{ 
  isOpen: boolean; onClose: () => void; onDelete: () => void; oldDifficulty: string; oldTopic: string[]; oldTitle: string; oldDetails: string
}> = ({ isOpen, onClose, onDelete, oldDifficulty, oldTopic, oldTitle, oldDetails}) => {
  
  if (isOpen && location.pathname == "/question") {
    return (
      <>
        <div id="deleteQuestionModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-3/5 h-9/10 fade-in modal-context z-50">
            {/* Header */}
            <div className="justify-start">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-red-500 text-2xl font-bold">Deleting Question</h2>
                <button 
                onClick={onClose} 
                id="submit"
                className="px-2 rounded-lg hover:bg-gray-200"
              >
                X
              </button>
              </div>
              <p className="text-sm">Are you sure you wish to delete the following question? This action cannot be reversed!</p>
            </div>
            
            <div className="mt-3"></div>
            {/* Difficulty */}
            <div>
              <label className="font-semibold">Difficulty Level</label>
              <div className="relative mt-1 shadow-md">
                <select 
                  name="difficulty" id="difficulty" value={oldDifficulty} disabled
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-750 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-opacity-50 focus:ring-black sm:text-sm sm:leading-6"
                >
                  <option value="" disabled selected hidden>Choose a difficulty level</option>
                  <option disabled className="text-green ">Easy</option>
                  <option disabled className="text-orange-500">Medium</option>
                  <option disabled className="text-red-700">Hard</option>
                </select>
              </div>
            </div>

            {/* Topic */}
            <div className="mt-2">
              <label className="font-semibold">Topic</label>
              <div className="relative mt-1 shadow-md">
                <text
                  name="topic" id="topic"
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-500 ring-1 ring-inset ring-gray-300 focus:outline-none sm:text-sm sm:leading-6"
                >{oldTopic}</text>
              </div>
            </div>

            {/* Question Title */}
            <div className="mt-2">
              <label className="font-semibold">Question Title</label>
              <div className="relative mt-1 shadow-md">
                <text
                  type="text" name="title" id="title"
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-500 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                >{oldTitle}</text>
              </div>
            </div>

            {/* Question details */}
            <div className="mt-2">
              <label className="font-semibold">Question details</label>
              <div className="relative mt-1 shadow-md">
                <textarea
                  id="details" rows={3} value={oldDetails} disabled
                  className="block w-full resize-none rounded-md border-0 px-2 py-1.5 text-gray-500 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                ></textarea>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6">
              <div className="flex justify-evenly mt-2">
              <button 
                  onClick={onDelete}
                  className="bg-black bg-opacity-80 rounded-lg px-4 py-1.5 text-white text-lg hover:bg-gray-600"
                >
                  Delete
                </button>
                <button 
                  onClick={onClose}
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

export default DeleteQuestionModal;