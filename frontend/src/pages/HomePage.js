import React, { useState } from "react";
import "../styles/HomePage.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export const HomePage = () => {
  // List
  const [rows, setRows] = useState([
    {
      id: 1,
      title: "Reverse a String",
      category: "Strings, Algorithms",
      complexity: "Easy",
    },
    {
      id: 2,
      title: "Linked List Cycle Detection",
      category: "Data Structures, Algorithms",
      complexity: "Easy",
    },
    {
      id: 3,
      title: "Roman to Integer",
      category: "Algorithms",
      complexity: "Easy",
    },
    {
      id: 4,
      title: "Add Binary",
      category: "Bit Manipulation, Algorithms",
      complexity: "Easy",
    },
    {
      id: 5,
      title: "Fibonacci Number",
      category: "Recursion, Algorithms",
      complexity: "Easy",
    },
    {
      id: 6,
      title: "Implement Stack using Queses",
      category: "Data Structures",
      complexity: "Easy",
    },
    {
      id: 7,
      title: "Combine Two Tables",
      category: "Databases",
      complexity: "Easy",
    },
    {
      id: 8,
      title: "Repeated DNA Sequences",
      category: "Algorithms, Bit Manipulation",
      complexity: "Medium",
    },
    {
      id: 9,
      title: "Course Schedule",
      category: "Data Structures, Algorithms",
      complexity: "Medium",
    },
    {
      id: 10,
      title: "LRU Cache Design",
      category: "Data Structures",
      complexity: "Medium",
    },
  ]);

  // Function to delete a row by id
  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  // Function to create a new row
  const createRow = () => {
    const newRow = {
      id: rows.length + 1,
      title: "New",
      category: "New Cat",
      complexity: "New Com",
    };
    setRows([...rows, newRow]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p className="welcome-text">Welcome to PeerPrep.</p>

        <table className="App-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Complexity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.title}</td>
                <td>{row.category}</td>
                <td>{row.complexity}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteRow(row.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="create-btn" onClick={createRow}>
          Create
        </button>
      </header>
    </div>
  );
};
