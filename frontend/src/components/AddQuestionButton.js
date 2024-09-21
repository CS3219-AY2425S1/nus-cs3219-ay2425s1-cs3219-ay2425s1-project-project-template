//src/components/AddQuestionButton.js
import React from 'react';

const AddQuestionButton = ({ onClick }) => {
  return (
    <button
      style={{
        position: "absolute", 
        top: "20px",
        right: "145px", 
      }}
      className="button-custom"
      onClick={onClick}
    >
      Add Question
    </button>
  );
};

export default AddQuestionButton;
