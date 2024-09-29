import React from "react";
import { useState } from "react";
import DeleteQuestionModal from "./DeleteQuestionModal";
import EditConfirmationModal from "./EditConfirmationModal";

const EditQuestionModal: React.FC<{
  onClose: () => void;
  oldDifficulty: string;
  oldTopic: string[];
  oldTitle: string;
  oldDetails: string;
  questionID: string;
  setQuestions: React.Dispatch<React.SetStateAction<never[]>>;
}> = ({ onClose, oldDifficulty, oldTopic, oldTitle, oldDetails, questionID, setQuestions }) => {
  const editQuestion = (questionID: string, difficultyValue: string, topicValue: string[], titleValue: string, detailsValue: string) => {
      fetch(`http://localhost:8080/questions/${questionID}`, {
          mode: "cors",
          method: 'PUT',
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:8080",
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: questionID,
            title: titleValue,
            description: detailsValue,
            categories: topicValue,
            complexity: difficultyValue
          })
        }).then(response => {
          response.json();
          retrieveAndSetQuestionList();
        })
        .then(data => console.log(data))
        .catch(error => {
          alert('Error adding question. Your newly edited question may be a duplicate (having the same title as an existing question). Please try again.');
          console.error('Error editing question:', error);
        });


      closeEditConfirmationModal();
      onClose();
  };

  const retrieveAndSetQuestionList = async () => {
    try {
      const response = await fetch("http://localhost:8080/questions", {
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:8080",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await response.json();
      
      // Assuming the API returns a structure like data._embedded.questionList
      setQuestions(data._embedded.questionList); 
      console.log("Testing: Question list should appear below");
      console.log(data._embedded.questionList);
      
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }
  

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const [isEditConfirmationModalOpen, setEditConfirmationModalOpen] =
    useState(false);
  const openEditConfirmationModal = () => setEditConfirmationModalOpen(true);
  const closeEditConfirmationModal = () => setEditConfirmationModalOpen(false);

  const [newDifficultyValue, setNewDifficultyValue] = useState(oldDifficulty);
  const [newTopicValue, setNewTopicValue] = useState(oldTopic);
  const [newTitleValue, setNewTitleValue] = useState(oldTitle);
  const [newDetailsValue, setNewDetailsValue] = useState(oldDetails);

  function getNewValues() {
    const difficultyElement = document.getElementById(
      "difficulty"
    ) as HTMLSelectElement | null;
    const difficultyValue = difficultyElement ? difficultyElement.value : "";
    setNewDifficultyValue(difficultyValue);

    const topicElement = document.getElementById(
      "topic"
    ) as HTMLInputElement | null;
    const topicValue = topicElement ? topicElement.value : "";
    const topicList = topicValue
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== "");
    setNewTopicValue(topicList);

    const titleElement = document.getElementById(
      "title"
    ) as HTMLInputElement | null;
    const titleValue = titleElement ? titleElement.value : "";
    setNewTitleValue(titleValue);

    const detailsElement = document.getElementById(
      "details"
    ) as HTMLInputElement | null;
    const detailsValue = detailsElement ? detailsElement.value : "";
    setNewDetailsValue(detailsValue);
  }

  function onDeleteConfirm() {
    closeDeleteModal();
    onClose();
  }

  function onEditConfirm() {
    getNewValues();
    editQuestion(questionID, newDifficultyValue, newTopicValue, newTitleValue, newDetailsValue);
  }

  const onEditSubmit = () => {
    getNewValues();

    /* Check if all fields are filled */
    if (
      newDifficultyValue == "" ||
      newTopicValue.length == 0 ||
      newTitleValue == "" ||
      newDetailsValue == ""
    ) {
      alert(
        newDifficultyValue + newTopicValue + newTitleValue + newDetailsValue
      );
      document.getElementById("emptyMessage")?.classList.remove("hidden");
      document.getElementById("emptyMessage")?.classList.add("visible");
    } else {
      /* All fields are filled -> ask user to confirm the changes */
      //alert(newDifficultyValue + newTopicValue + newTitleValue + newDetailsValue);
      document.getElementById("emptyMessage")?.classList.remove("visible");
      document.getElementById("emptyMessage")?.classList.add("hidden");
      openEditConfirmationModal();
    }
  };

  return (
    <div
      id="editQuestionModal"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 text-black"
    >
      <div className="bg-white rounded-lg p-4 w-3/5 h-9/10 fade-in modal-context z-50">
        {/* Header */}
        <div className="justify-start">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-2xl font-bold">Edit Question</h2>
            <button
              onClick={() => onClose()}
              id="submit"
              className="px-2 rounded-lg hover:bg-gray-200"
            >
              X
            </button>
          </div>
          <div>
            <p className="text-sm">Editing "{oldTitle}" Question.</p>
            {/* <button className="text-sm text-indigo-800 hover:bg-gray-200 rounded-lg">Click here to view the original question for reference.</button> */}
          </div>
        </div>

        <div className="mt-3"></div>
        {/* Difficulty */}
        <div>
          <label className="font-semibold">Complexity Level</label>
          <div className="relative mt-1 shadow-md">
            <select
              name="difficulty"
              id="difficulty"
              defaultValue={oldDifficulty}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-opacity-50 focus:ring-black sm:text-sm sm:leading-6"
            >
              <option value="" disabled hidden>
                Choose a difficulty level
              </option>
              <option value="EASY" className="text-green ">Easy</option>
              <option value="MEDIUM" className="text-orange-500">Medium</option>
              <option value="HARD" className="text-red-700">Hard</option>
            </select>
          </div>
        </div>

        {/* Topic */}
        <div className="mt-2">
          <label className="font-semibold">Categories</label>
          <p className="text-xs text-gray-500">Separate different topic categories using commas. E.g., Arrays, Databases </p>
          <div className="relative mt-1 shadow-md">
            <input
              type="text"
              name="topic"
              id="topic"
              defaultValue={oldTopic}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-opacity-50 focus:ring-black sm:text-sm sm:leading-6"
            ></input>
          </div>
        </div>

        {/* Question Title */}
        <div className="mt-2">
          <label className="font-semibold">Question Title</label>
          <div className="relative mt-1 shadow-md">
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={oldTitle}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-opacity-50 focus:ring-black sm:text-sm sm:leading-6"
            ></input>
          </div>
        </div>

        {/* Question details */}
        <div className="mt-2">
          <label className="font-semibold">Question description</label>
          <div className="relative mt-1 shadow-md">
            <textarea
              name="details"
              id="details"
              defaultValue={oldDetails}
              rows={3}
              className="block w-full resize-none rounded-md border-0 px-2 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-opacity-50 focus:ring-black sm:text-sm sm:leading-6"
            ></textarea>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6">
          <text
            id="emptyMessage"
            className="flex justify-center text-red-500 hidden"
          >
            * Please fill in all the empty fields. *
          </text>
          <div className="flex justify-evenly mt-2">
            <button
              onClick={openDeleteModal}
              className="bg-black bg-opacity-80 rounded-lg px-4 py-1.5 text-white text-lg hover:bg-gray-600"
            >
              Delete Question
            </button>
            {isDeleteModalOpen && <DeleteQuestionModal
              onClose={closeDeleteModal}
              onDelete={onDeleteConfirm}
              oldDifficulty={oldDifficulty}
              oldTopic={oldTopic}
              oldTitle={oldTitle}
              oldDetails={oldDetails}
              questionID={questionID}
            />}
            <button
              onClick={onEditSubmit}
              className="bg-green rounded-lg px-4 py-1.5 text-white text-lg hover:bg-emerald-400"
            >
              Submit
            </button>
            {isEditConfirmationModalOpen && <EditConfirmationModal
              onClose={closeEditConfirmationModal}
              onEditConfirm={onEditConfirm}
              newDifficultyValue={newDifficultyValue}
              newTopicValue={newTopicValue}
              newTitleValue={newTitleValue}
              newDetailsValue={newDetailsValue}
            />}
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
  );
};

export default EditQuestionModal;
