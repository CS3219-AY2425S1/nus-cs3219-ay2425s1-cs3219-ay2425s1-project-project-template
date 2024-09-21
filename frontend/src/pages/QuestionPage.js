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
      // Fetch or define questions data here
      // Linkage to mongoDB here maybe
    setQuestions([
      {
        id: 1,
        title: "Two Sum",
        category: "Array",
        complexity: "Easy",
      },
      {
        id: 2,
        title: "Three Sum",
        category: "Array",
        complexity: "Medium",
      },
      {
        id: 3,
        title: "Longest Substring Without Repeating Characters",
        category: "String",
        complexity: "Medium",
      },
      {
        id: 4,
        title: "Merge Intervals",
        category: "Array",
        complexity: "Medium",
      },
      {
        id: 5,
        title: "Valid Parentheses",
        category: "String",
        complexity: "Easy",
      },
      {
        id: 6,
        title: "Binary Tree Inorder Traversal",
        category: "Tree",
        complexity: "Easy",
      },
      {
        id: 7,
        title: "Add Two Numbers",
        category: "Linked List",
        complexity: "Medium",
      },
      {
        id: 8,
        title: "Product of Array Except Self",
        category: "Array",
        complexity: "Medium",
      },
      {
        id: 9,
        title: "Search in Rotated Sorted Array",
        category: "Array",
        complexity: "Medium",
      },
      {
        id: 10,
        title: "Longest Palindromic Substring",
        category: "String",
        complexity: "Medium",
      },
    ]);
  }, []);

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }

    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  function handleAddQuestion(newQuestion) {
    toggleDialog();

    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { id: prevQuestions.length + 1, ...newQuestion },
    ]);
  }

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
