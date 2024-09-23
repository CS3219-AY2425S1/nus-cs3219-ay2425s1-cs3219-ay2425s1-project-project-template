import React from "react";
//import { useParams } from "react-router-dom";
import "../styles/ReadPage.css";

export const ReadPage = () => {
  // Insert the logic and API to get the question

  return (
    <div className="question-details">
      <div className="category">
        <p>Data Structures, Algorithms</p>
      </div>
      {/* Container for title and complexity */}
      <div className="title-complexity">
        <div className="title">
          <h2>Linked List Cycle Detection</h2>
        </div>
        <div className="complexity">
          <p>Easy</p>
        </div>
      </div>

      <div className="divider"></div>

      <div className="description">
        <p>Implement a function to detect if a linked list contains a cycle.</p>
      </div>

      <div className="edit-delete-btn">
        <button className="edit-btn">Edit</button>
        <button className="delete-btn">Delete</button>
      </div>
    </div>
  );
};
