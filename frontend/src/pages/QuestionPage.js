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
  const dialogRef  = useRef(null);

  useEffect(() => {
      const fetchQuestions = async () => {
        try {
          const response = await fetch('http://localhost:8080/questions'); // Replace with your backend URL
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setQuestions(data); // Update the state with fetched questions
        } catch (error) {
          console.error('Error fetching questions:', error);
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
        const response = await fetch('http://localhost:8080/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newQuestion),
        });
        if (response.ok) {
          const savedQuestion = await response.json();
          setQuestions((prevQuestions) => [...prevQuestions, savedQuestion]);
        } else {
          console.error('Failed to add question');
        }
      } catch (error) {
        console.error('Error adding question:', error);
      }
    };

  function handleEditQuestion(question) {
    setDialogForm(<EditQuestionForm question={question} onUpdate={handleUpdateQuestion} />);
    toggleDialog();
  }

  function handleUpdateQuestion(updatedQuestion) {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
    toggleDialog();
  }

  return (
    <div style={{ paddingTop: "70px" }}>
      <h1></h1>
      <AddQuestionButton onClick={() => {
        setDialogForm(<AddQuestionForm onAdd={handleAddQuestion} />);
        toggleDialog();
    
      }} />
      <QuestionTable questions={questions} onEdit={handleEditQuestion} />
      <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
          {dialogForm}
      </Dialog>
    </div>
  );
};

export default QuestionPage;
