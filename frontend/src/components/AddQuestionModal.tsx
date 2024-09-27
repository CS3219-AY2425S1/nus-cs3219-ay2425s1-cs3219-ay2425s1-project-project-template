import React from "react";


const AddQuestionModal: React.FC<{ isOpen: boolean; onClose: () => void}> = ({ isOpen, onClose}) => {
  function onSubmit() {
    const difficultyElement = document.getElementById('difficulty') as HTMLSelectElement | null;
    const difficultyValue = difficultyElement ? difficultyElement.value : '';
    
    const topicElement = document.getElementById("topic") as HTMLInputElement | null;
    const topicValue = topicElement ? topicElement.value : "";
    
    const titleElement = document.getElementById("title") as HTMLInputElement | null;
    const titleValue = titleElement ? titleElement.value : "";
    
    const detailsElement = document.getElementById("details") as HTMLInputElement | null;
    const detailsValue = detailsElement ? detailsElement.value : "";

    if (difficultyValue == "" || topicValue == "" || titleValue == "" || detailsValue == "") {
      //alert(difficultyValue + topicValue + titleValue + detailsValue);
      
      document.getElementById("emptyMessage")?.classList.remove("hidden");
      document.getElementById("emptyMessage")?.classList.add('visible');
    } else {
      //alert(difficultyValue + topicValue + titleValue + detailsValue);
      document.getElementById("emptyMessage")?.classList.remove("visible");
      document.getElementById("emptyMessage")?.classList.add('hidden');
    }
  }

  if (isOpen && location.pathname == "/question") {
    return (
      <>
        <div id="addQuestionModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 text-black">
          <div className="bg-white rounded-lg p-4 w-3/5 h-9/10 fade-in modal-context z-50">
            {/* Header */}
            <div className="justify-start">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-2xl font-bold">Add Question</h2>
                <button 
                onClick={onClose} 
                id="submit"
                className="px-2 rounded-lg hover:bg-gray-200"
              >
                X
              </button>
              </div>
              <p className="text-sm">Fill in all the fields. Click "Submit" when done.</p>
            </div>
            
            <div className="mt-3"></div>
            {/* Difficulty */}
            <div>
              <label className="font-semibold">Difficulty Level</label>
              <div className="relative mt-1 shadow-md">
                <select 
                  name="difficulty" id="difficulty" 
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
                  type="text" name="topic" id="topic"
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-opacity-50 focus:ring-black sm:text-sm sm:leading-6"
                ></input>
              </div>
            </div>

            {/* Question Title */}
            <div className="mt-2">
              <label className="font-semibold">Question Title</label>
              <div className="relative mt-1 shadow-md">
                <input 
                  type="text" name="title" id="title" 
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-opacity-50 focus:ring-black sm:text-sm sm:leading-6"
                ></input>
              </div>
            </div>

            {/* Question details */}
            <div className="mt-2">
              <label className="font-semibold">Question details</label>
              <div className="relative mt-1 shadow-md">
                <textarea
                  name="details" id="details" 
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

export default AddQuestionModal;