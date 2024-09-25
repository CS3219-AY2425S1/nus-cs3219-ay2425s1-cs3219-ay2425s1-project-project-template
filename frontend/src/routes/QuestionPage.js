import React, { useState } from 'react';
import './QuestionPage.css'; 

const QuestionPage = () => {

  //shared logic between left and right, probably just the edit/create new qn state

  //Either create or edit mode.
  const [mode, setMode] = useState("create");
  const [questionEdit, setEdit] = useState("None");



  //left side logic
  const [questions, setQuestions] = useState([
    { id: 1, title: "item1", complexity: "Easy", description: "Implement a function to detect if a linked list contains a cycle." },
    { id: 2, title: "item2", complexity: "Medium", description: "Description for item2" },
    { id: 3, title: "item3", complexity: "Hard", description: "Description for item3" },
    // more items...
  ]);

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleTitleClick = (question) => {
    setSelectedQuestion(selectedQuestion === question ? null : question);
  };

  const handleDelete = () => {
    // setQuestions(questions.filter((question) => question.id !== selectedQuestion.id));
    // setSelectedQuestion(null);  // Clear selected question after deletion
    // call delete api on question id
  };




  //Right side logic
  const [difficulty, setDifficulty] = useState('easy');
  const [topic, setTopic] = useState('loops');
  const [question, setQuestion] = useState('');


  const clearState = () => {
    setDifficulty("easy");
    setTopic("loops");
    setQuestion("");
  }

  // Handle API call on button press
  const handleSetQuestion = async () => {
    // Prepare data
    const data = {
      difficulty,
      topic,
      question,
    };

    try {
      // Make API call (replace 'your-api-url' with your actual API endpoint)
      const response = await fetch('your-api-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Clear the question field if the request was successful
        setQuestion('');
        alert('Question submitted successfully!');
      } else {
        alert('Failed to submit question.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    }
  };





  return (
    <div class="question-page-container">
      <div className="left-section pr-4 overflow-y-auto" style={{ width: '45%' }}>
        <h1 className="text-2xl font-bold mb-4">Question Repository</h1>
        <table className="min-w-full table-fixed bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 border-b w-1/2">Question Title</th>
              <th className="py-2 px-4 border-b w-1/4">Complexity</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr
                key={question.id}
                className={`${
                  index % 2 === 0 ? 'bg-blue-50' : 'bg-white'
                } hover:bg-blue-100 cursor-pointer transition duration-300`}
                onClick={() => handleTitleClick(question)}
              >
                <td className="py-2 px-4 border-b">{question.title}</td>
                <td className="py-2 px-4 border-b">{question.complexity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Display selected question's description and delete button */}
        <div className="mt-4">
          {selectedQuestion ? (
            <div className="p-4 border border-gray-300 rounded-lg shadow-lg bg-white">
              <h2 className="font-bold text-xl">{selectedQuestion.title} - Description</h2>
              <p className="mt-2 text-gray-700">{selectedQuestion.description}</p>
              
              <div className="mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Delete Question
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a question to see the description.</p>
            </div>
          )}
        </div>
      </div>


      {/**Right section uses normal CSS, 55% vw. */}

      <div class="right-section">

        <div class="info-row" id="curmode">
          Mode: {mode === "create" ? "Creating new question" : "Editing question"}
        </div>

        <div class="row">
          <label htmlFor="difficulty">Difficulty:</label>
          <select 
            id="difficulty" 
            className="dropdown" 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <label htmlFor="topic">Topic:</label>
          <select 
            id="topic" 
            class="dropdown"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="loops">Loops</option>
            <option value="arrays">Arrays</option>
            <option value="conditions">Conditions</option>
          </select>
        </div>

        <div class="question-section">
          <label htmlFor="question">Question:</label>
          <textarea
          id="question"
          className="textarea"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div class="button-section">

          <div class = "button-box">
            <button class="clear-question-button" onClick={clearState}>Clear/Exit</button>
          </div>

          <div class="button-box-right" onClick={handleSetQuestion}>
            <button class="set-question-button">Set Question</button>
          </div>
        </div>
      </div>




    </div>
  );
};

export default QuestionPage;
