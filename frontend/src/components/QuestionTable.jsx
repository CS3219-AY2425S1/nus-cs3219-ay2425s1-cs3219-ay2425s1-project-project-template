import React, { useState } from "react";
import styles from './QuestionTable.module.css'; // Import CSS Module

const QuestionTable = ({ questions, handleDelete, handleCreate, handleEdit }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    questionId: '',
    questionName: '',
    questionDescription: '',
    questionTopics: [],
    link: '',
    questionDifficulty: 'Easy', // Default value
  });

  const predefinedTopics = [
    "Arrays", 
    "Strings", 
    "Trees", 
    "Graphs", 
    "Sorting", 
    "Dynamic Programming", 
    "Algorithms", 
    "Data Structures", 
    "Bit Manipulation", 
    "Recursion", 
    "Databases", 
    "Brainteaser"
  ];

  const [isEditing, setIsEditing] = useState(false); // New state for editing

  const toggleForm = () => {
    setShowForm(prevForm => !prevForm); //ensures latest state value
  }

  // updates dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const resetForm = () => {
    setFormData({
      questionId: '',
      questionName: '',
      questionDescription: '',
      questionTopics: '',
      link: '',
      questionDifficulty: 'Easy', // Default value
    })
  }

  const handleEditClick = (question) => {
    setIsEditing(true);
    setFormData({
      questionId: question["Question ID"],
      questionName: question["Question Title"],
      questionDescription: question["Question Description"], 
      questionTopics: question["Question Categories"], 
      link: question["Link"],
      questionDifficulty: question["Question Complexity"],
    });
    toggleForm(); // Show the form for editing
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { questionId, questionName, questionDescription, questionTopics, link, questionDifficulty } = formData;

    // Validation checks
    if (!questionId || !questionName || !questionDescription || !link || questionTopics.length === 0 || !questionDifficulty) {
      alert("Please fill in all fields. At least one topic must be selected, and a difficulty must be chosen.");
      return; // Prevent submission if validation fails
    }

    if (isEditing) {
      handleEdit(questionId, questionName, questionDescription, questionTopics, link, questionDifficulty);
      setIsEditing(false); 
    } else {
      handleCreate(questionId, questionName, questionDescription, questionTopics, link, questionDifficulty);
    }
    toggleForm();
    resetForm();

  }

  const handleTopicClick = (topic) => {
    setFormData(prevData => {
      let selectedTopics = prevData.questionTopics;

      if (selectedTopics.includes(topic)) {
        selectedTopics = selectedTopics.filter(t => t !== topic); // Deselect topic
      } else {
        selectedTopics = [...selectedTopics, topic]; // Select topic
      }

      return { ...prevData, questionTopics: selectedTopics };
    });
  };

  const handleDifficultyClick = (difficulty) => {
    setFormData(prevData => ({
      ...prevData,
      questionDifficulty: difficulty,
    }));
  };



  const getComplexityClass = (complexity) => {
    switch (complexity) {
      case 'Easy':
        return styles.easy;
      case 'Medium':
        return styles.medium;
      case 'Hard':
        return styles.hard;
      default:
        return '';
    }
  };

  const formatString = (input) => {
    if (Array.isArray(input)) {
        input = input.join(', '); 
        console.log(input);
    } else if (typeof input !== 'string') {
        console.error('Expected a string or an array but received:', input);
        return ''; 
    }
    
    return input.replace(/[\[\]"]/g, "");
};
  

  return (
    
    <div className={styles.questionTable}>
      <section className={showForm ? `${styles.tableHeader} ${styles.blurred}` :styles.tableHeader}>
        <h1>Question List</h1>
        <button onClick={toggleForm}>Add Question</button>
      </section>
      
      {showForm && (
        <>
          <div className={styles.overlay}>
            <div className={styles.modal}>
              <button className={styles.closeButton} onClick={() => {toggleForm(); resetForm();}}>&times;</button>
              <form className={styles.form} onSubmit={handleSubmit}>
                <h3>{isEditing? 'Edit question' : 'Add question'}</h3>
                <div>
                  <label>ID:</label>
                  <input type="number" name="questionId" value={formData.questionId} onChange={handleChange} required />
                </div>
                <div>
                  <label>Title:</label>
                  <input type="text" name="questionName" value={formData.questionName} onChange={handleChange} required />
                </div>
                <div>
                  <label>Description:</label>
                  <textarea name="questionDescription" value={formData.questionDescription} onChange={handleChange} required />
                </div>
                <div>
                <label>Topics:</label>
                <div className={styles.topicsContainer}>
                  {predefinedTopics.map((topic) => (
                    <button
                      type="button"
                      key={topic}
                      className={`${styles.topicBubble} ${formData.questionTopics.includes(topic) ? styles.selected : ''}`}
                      onClick={() => handleTopicClick(topic)}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

                <div>
                  <label>Link:</label>
                  <input type="url" name="link" value={formData.link} onChange={handleChange} required />
                </div>
                <div className={styles.difficultyContainer}>
                  <label>Difficulty:</label>
                    {['Easy', 'Medium', 'Hard'].map(difficulty => (
                      <button
                        key={difficulty}
                        type="button"
                        className={`${styles.bubbleButton} ${formData.questionDifficulty === difficulty ? `${styles.selected} ${styles[difficulty.toLowerCase()]}` : ''}`}
                        onClick={() => handleDifficultyClick(difficulty)}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        </>
      )}

      <section className={showForm ? `${styles.tableSection} ${styles.blurred}` : styles.tableSection} >
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Question</th>
              <th>Categories</th>
              <th>Difficulty</th>
              <th>Link</th>
              <th className={styles.fill}></th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              
              <tr key={question["Question ID"]}>
                <td>{question["Question ID"]}</td>
                <td>{question["Question Title"]}</td>
                <td>{formatString(question["Question Categories"])}</td>
                <td>
                  <p className={styles.complexity + ' ' + getComplexityClass(question["Question Complexity"])}>
                    {question["Question Complexity"]}
                  </p>
                </td>
                <td>
                  <a href={question["Link"]} target="_blank" rel="noopener noreferrer">
                    View Problem
                  </a>
                </td>
                <td className={styles.buttons}>
                  <button onClick={() => handleEditClick(question)}>Edit</button>
                  <button onClick={() => handleDelete(question["Question ID"])}>delete</button>
                </td>
                <td>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default QuestionTable;
