import React from 'react';

const AddQuestionButton = ({ onClick }) => {
    return (
        <button style={{margin: "0 0 1rem 10%"}} className="button-custom" onClick={onClick}>
            Add Question
        </button>
    );
};

export default AddQuestionButton;
