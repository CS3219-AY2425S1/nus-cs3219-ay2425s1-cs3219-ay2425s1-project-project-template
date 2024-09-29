/**
 * AddQuestion Component
 * 
 * This component renders the form for adding a new question to the question repository.
 * It uses the QuestionForm component to capture the details of the question.
 * 
 * @component
 */

import React from 'react';
import QuestionForm from './QuestionForm';

const AddQuestion = () => {
  return (
    <div>
      <h2>Add New Question</h2>
      <QuestionForm />
    </div>
  );
};

export default AddQuestion;
