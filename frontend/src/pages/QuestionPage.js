/* src/pages/QuestionPage.css */

import React, { useState, useEffect, useRef } from "react";
import "../components/DialogForm.css";
import AddQuestionButton from "../components/AddQuestionButton";
import AddQuestionForm from "../components/AddQuestionForm";
import Dialog from "../components/Dialog";
import EditQuestionForm from "../components/EditQuestionForm";
import QuestionTable from "../components/QuestionTable";

const QuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [dialogForm, setDialogForm] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:8080/questions");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setQuestions(data); // Update the state with fetched questions
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions(); // Call the fetch function on component mount
  }, []); // Empty dependency array to run only once

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }

    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }
  const handleAddQuestion = async (newQuestion) => {
    toggleDialog();

    try {
      const response = await fetch("http://localhost:8080/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        const savedQuestion = await response.json();

        // check the new question
        console.log("savedQuestion:", savedQuestion);

        setQuestions((prevQuestions) => [...prevQuestions, savedQuestion]);
      } else {
        console.error("Failed to add question");
      }
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleEditQuestion = async (question) => {
    setDialogForm(
      <EditQuestionForm question={question} onUpdate={handleUpdateQuestion} />
    );
    toggleDialog();
  };

  const handleUpdateQuestion = async (updatedQuestion) => {
    try {
      console.log("Updating question with ID:", updatedQuestion._id); // Log the ID being used
      const response = await fetch(
        `http://localhost:8080/questions/${updatedQuestion._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedQuestion), // Send the updated question dat
        }
      );

      console.log("updatedQuestion:", updatedQuestion);

      if (response.ok) {
        const savedQuestion = await response.json(); // Parse the updated question
        console.log("Saved question:", savedQuestion); // Log the saved question

        setQuestions(
          (prevQuestions) =>
            prevQuestions.map((q) =>
              q._id === savedQuestion._id ? savedQuestion : q
            ) // Update the specific question
        );
      } else {
        const errorMessage = await response.text(); // Get error message from response
        console.error(
          `Failed to edit question: ${response.status} ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("Error editing question:", error);
    }
    toggleDialog();
  };

  return (
    <div style={{ paddingTop: "70px" }}>
      <h1></h1>
      <AddQuestionButton
        onClick={() => {
          setDialogForm(<AddQuestionForm onAdd={handleAddQuestion} />);
          toggleDialog();
        }}
      />
      <QuestionTable questions={questions} onEdit={handleEditQuestion} />
      <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
        {dialogForm}
      </Dialog>
    </div>
  );
};

export default QuestionPage;
