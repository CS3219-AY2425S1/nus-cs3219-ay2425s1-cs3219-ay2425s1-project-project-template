// src/pages/QuestionPage.js
import React, { useState, useEffect } from "react";
import QuestionTable from "../components/QuestionTable";

const QuestionPage = () => {
  const [questions, setQuestions] = useState([]);

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

  return (
    <div style={{ paddingTop: "70px" }}>
      <h1></h1>
      <QuestionTable questions={questions} />
    </div>
  );
};

export default QuestionPage;
