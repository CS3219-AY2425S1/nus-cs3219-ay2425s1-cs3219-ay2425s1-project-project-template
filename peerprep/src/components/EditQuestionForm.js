// src/components/EditQuestionForm.js
import React, { useState, useEffect } from "react";

const EditQuestionForm = ({ question, onUpdate }) => {
  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description);
  const [category, setCategory] = useState(question.category);
  const [complexity, setComplexity] = useState(question.complexity);

  useEffect(() => {
    setTitle(question.title);
    setDescription(question.description);
    setCategory(question.category);
    setComplexity(question.complexity);
  }, [question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...question, title, description, category, complexity });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label>
        Category:
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </label>
      <label>
        Complexity:
        <input
          type="text"
          value={complexity}
          onChange={(e) => setComplexity(e.target.value)}
        />
      </label>
      <button type="submit">Update Question</button>
    </form>
  );
};

export default EditQuestionForm;
