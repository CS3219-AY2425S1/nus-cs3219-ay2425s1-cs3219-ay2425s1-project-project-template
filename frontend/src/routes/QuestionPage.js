import React, { useState, useEffect } from 'react';
import './QuestionPage.css'; 

const QuestionPage = () => {

  //shared logic between left and right, probably just the edit/create new qn state
  const apiurl = "http://127.0.0.1:8000/question/"


  // Fetch all questions on component mount
    useEffect(() => {
      fetchQuestions();
    }, []);


  // Fetch questions from the API
  const fetchQuestions = async () => {
    try {
      const response = await fetch(apiurl, { method: 'GET' });
      if (response.ok) {
        const data = await response.json();

        // Transform the response object into an array
        const arrayData = Object.values(data); // Use data, not jsonData
        console.log(arrayData);

        // Update the questions with the array data
        updateQuestions(arrayData);
      } else {
        alert('Failed to fetch questions.');
        updateQuestions([]); // Set to an empty array if the request fails
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      updateQuestions([]); // Set to an empty array in case of error
    }
  };

    
  //Either create or edit mode.
  const [mode, setMode] = useState("create");
  //mode = "edit";

  // left side logic
  const [questions, updateQuestions] = useState([]);


  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleTitleClick = (question) => {
    setSelectedQuestion(question);
    setMode("create");
    setTitle("Some_Title");
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${apiurl}${selectedQuestion.titleSlug}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove the deleted question from the list
        updateQuestions(questions.filter((question) => question.titleSlug !== selectedQuestion.titleSlug));
        setSelectedQuestion(null);
        alert('Question deleted successfully!');
      } else {
        alert('Failed to delete the question.');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleEdit = () => {
    setMode("edit");
    setTitle(selectedQuestion.title); // Set the question title to edit
    console.log(selectedQuestion.title);
    // Optionally, prefill the form fields with selected question data
  };


  //Right side logic
  const [difficulty, setDifficulty] = useState('easy');
  const [topic, setTopic] = useState('loops');
  const [title, setTitle] = useState('Some_Title');
  const [question, setQuestion] = useState('');

  //REMOVE THIS BEFORE SUBMITTING
  const [titleSlug] = useState('test-question')


  const clearState = async () => {
    /** 
     * 
    //THIS IS FOR TESTING THE API!!!!!!!

    const response = await fetch('http://127.0.0.1:8000/question/', {
      method: 'GET', // Explicitly specifying the GET method
  });
                if (response.ok) {
                  const data = await response.json();
                alert(JSON.stringify(data)); 
                }
                else{alert("gg")}
      
            */    

    setDifficulty("easy");
    setTopic("loops");
    setTitle("Some_Title");
    setQuestion("");
    setMode("create");
  }

  // Handle API call on button press
  const handleSetQuestion = async () => {
    // Prepare data
    const data = {
      title,
      question,
      difficulty,
      topic,
      titleSlug,
    };

    if (mode === "create"){
      try {
        const response = await fetch('http://127.0.0.1:8000/question/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          // Clear the fields if the request was successful
          setDifficulty("easy");
          setTopic("loops");
          setTitle("Some_Title");
          setQuestion("");
          
          // get newest question data from response
          const newQuestion = await response.json();
          // Update the questions state to include the new question
          console.log(newQuestion);
          updateQuestions(prevQuestions => [...prevQuestions, newQuestion]);

          alert('Question submitted successfully!');
        } else {
          alert('Failed to submit question. Make sure questions are not duplicates. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the question. Error:'+error);
      }
    } else{
      const patchdata = {
        question,
        difficulty,
        topic,
        titleSlug,
      };
      try {
        alert(`http://127.0.0.1:8000/question/${title}`)
        const response = await fetch(`http://127.0.0.1:8000/question/${title}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(patchdata),
        });
  
        if (response.ok) {
          // Clear the fields if the request was successful
          setDifficulty("easy");
          setTopic("loops");
          setTitle("Some_Title");
          setQuestion("");
          alert('Question submitted successfully!');
        } else {
          alert('Failed to submit question. Make sure questions are not duplicates. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the question. Error:'+error);
      }
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
              <th className="py-2 px-4 border-b w-1/4">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr
                key={question.titleSlug}
                className={`${
                  index % 2 === 0 ? 'bg-blue-50' : 'bg-white'
                } hover:bg-blue-100 cursor-pointer transition duration-300`}
                onClick={() => handleTitleClick(question)}
              >
                <td className="py-2 px-4 border-b">{question.title}</td>
                <td className="py-2 px-4 border-b">{question.difficulty}</td>
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
              
              <div className="mt-4 flex justify-between">
                {/* Delete Button */}
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Delete Question
                </button>

                {/* Edit Button */}
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 ml-auto"
                  onClick={handleEdit}
                >
                  Edit Question
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
          Mode: {mode === "create" ? "Creating new question" : `Editing question: ${selectedQuestion.title}`}
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

        <div class="title-section">
          <label htmlFor="title">Title:</label>
          {mode === 'edit' ? (
            <textarea
              id="title"
              className="questionarea"
              value={selectedQuestion.title}
              readOnly // Make the textarea read-only
            />
          ) : (
            <textarea
              id="title"
              className="questionarea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          )}
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
