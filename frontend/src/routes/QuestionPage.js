import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Panel, PanelGroup } from "react-resizable-panels";
import './QuestionPage.css';
const QuestionPage = () => {

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

        // Update the questions with the array data
        updateQuestions(arrayData);
        
        // // Loop through each question and set its data
        // arrayData.forEach(question => {
        //   setQuestionData({
        //     difficulty: question.difficulty,
        //     topic: question.topic,
        //     title: question.title,
        //     description: question.description,
        //     titleSlug: question.titleSlug,
        //   });

        //   console.log(question);
        // });
        
      } else {
        alert('Failed to fetch questions.');
        updateQuestions([]); // Set to an empty array if the request fails
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      updateQuestions([]); // Set to an empty array in case of error
    }
  };


  // //REMOVE THIS BEFORE SUBMITTING
  // const [titleSlug] = useState('test-question');


  // State for questions and the current question data
   const [questions, updateQuestions] = useState([]);
   const [selectedQuestion, setSelectedQuestion] = useState(null);
   const [mode, setMode] = useState("create"); //Either create or edit mode.


  // Consolidated state for question data
  const [questionData, setQuestionData] = useState({
    difficulty: 'Easy',
    topic: 'loops',
    title: 'Some_Title',
    description: '',
    titleSlug: 'test-question' // Static value; consider changing if needed
  });


  const handleTitleClick = (question) => {
    setSelectedQuestion(question);
    setMode("create");
    setQuestionData({
      ...questionData,
      title: "Some_Title",
    });
    clearState();
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
    if (selectedQuestion) {
      setMode("edit");
      setQuestionData({
        difficulty: selectedQuestion.difficulty,
        topic: selectedQuestion.topic,
        title: selectedQuestion.title,
        description: selectedQuestion.description,
        titleSlug: selectedQuestion.titleSlug,
      });
    }
  };
  
  
  const clearState = async () => {
    //   //THIS IS FOR TESTING THE API!!!!!!!
    //   const response = await fetch('http://127.0.0.1:8000/question/', {
    //     method: 'GET', // Explicitly specifying the GET method
    // });
    //               if (response.ok) {
    //                 const data = await response.json();
    //               alert(JSON.stringify(data)); 
    //               }
    //               else{alert("gg")}
    //           */    

    setQuestionData({
      difficulty: "Easy",
      topic: "loops",
      title: "Some_Title",
      description: "",
      titleSlug: "test-question",
    });
    setMode("create");
  }

  // Handle API call on button press
  const handleSetQuestion = async () => {
    const data = {
      ...questionData,
    };

    if (mode === "create") {
      try {
        const response = await fetch(apiurl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const newQuestion = await response.json();
          updateQuestions(prevQuestions => [...prevQuestions, newQuestion]);
          setSelectedQuestion(newQuestion);
          alert('Question submitted successfully!');
          clearState(); // Clear the state after submitting
        } else if (response.status == 400) {
          alert("no duplicate question titles allowed!");
        } else {
          const response_text = await response.text();
          const text_data = JSON.parse(response_text);
          if (text_data.errors) {
            text_data.errors.forEach(error => {
              alert(error.msg);
            });
          }
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the question. Error: ' + error);
      }
    } else {
      try {
        const response = await fetch(`${apiurl}${questionData.titleSlug}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const updatedQuestion = await response.json();
          updateQuestions(prevQuestions => 
            prevQuestions.map(question => 
              question.titleSlug === updatedQuestion.titleSlug ? updatedQuestion : question
            )
          );
          setSelectedQuestion(updatedQuestion);
          alert('Question updated successfully!');
          clearState();
        } else if (response.status == 400) {
          alert("no duplicate question titles allowed!");
        } else {
          const response_text = await response.text();
          const text_data = JSON.parse(response_text);
          if (text_data.errors) {
            text_data.errors.forEach(error => {
              alert(error.msg);
            });
          }
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the question. Error: ' + error);
      }
    }
  };

  return (
    <div className="question-page-container">
      <h1 className="text-2xl font-bold mb-4">Question Repository</h1>
      <PanelGroup direction="horizontal">
        <>  
          <Panel id="questions" order={1} className='m-1'>
            <div className='flex flex-col overflow-auto h-96 rounded-xl'>
              <table className="min-w-full table-fixed bg-white border border-gray-300 rounded-xl">
                <thead className='bg-blue-500 text-white sticky top-0 '>
                  <tr className='text-left'>
                    <th className="py-2 px-4 border-b w-1/2">Question Title</th>
                    <th className="py-2 px-4 border-b w-1/4">Difficulty</th>
                    <th className="py-2 px-4 border-b w-1/4">Topic</th>
                  </tr>
                </thead>
                <tbody className='h-96 overflow-y-auto'>
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
                      <td className="py-2 px-4 border-b">{question.topic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </>
        

        {/* Display selected question's description and delete button */}
        {selectedQuestion && (
          <>
            <Panel id="details" order={2} className='m-1' style={{overflowY: "scroll", overflowX: "auto"}}>
            <div className="sticky top-0 mb-2 flex w-full justify-between gap-x-1 bg-white p-3 rounded-xl shadow-md">
                <button onClick={() => setSelectedQuestion(null)}>Hide</button>
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
            <div className="p-4 border border-gray-300 rounded-xl shadow-lg bg-white overflow-auto">
              <h2 className="font-bold text-xl">{selectedQuestion.title}</h2>
              <h3 className="text-lg">Difficulty: {selectedQuestion.difficulty}</h3>
              <h3 className="text-lg">Topic: {selectedQuestion.topic}</h3>

              {/* Render the question description as Markdown */}
              <ReactMarkdown className="mt-2 text-gray-700">
                {selectedQuestion.description}
              </ReactMarkdown>
              

            </div>
            </Panel>
          </>
        )
        }
        </PanelGroup>

      {/* <div className="right-section" style={{ width: '55%' }}>
        <div className="info-row" id="curmode">
          Mode: {mode === "create" ? "Creating new question" : `Editing question: ${selectedQuestion.title}`}
        </div>

        <div className="row">
          <label htmlFor="difficulty">Difficulty:</label>
          <select 
            id="difficulty" 
            className="dropdown" 
            value={questionData.difficulty}
            onChange={(e) => setQuestionData({ ...questionData, difficulty: e.target.value })}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <label htmlFor="topic">Topic:</label>
          <textarea 
            id="topic" 
            className="dropdown1"
            value={questionData.topic}
            onChange={(e) => setQuestionData({ ...questionData, topic: e.target.value })}
          />
        </div>

        <div className="title-section">
          <label htmlFor="title">Title:</label>
          <textarea
            id="title"
            className="questionarea"
            value={mode === 'edit' ? selectedQuestion.title : questionData.title}
            onChange={(e) => setQuestionData({ ...questionData, title: e.target.value })}
            readOnly={mode === 'edit'} // Make the textarea read-only if in edit mode
          />
        </div>

        <div className="question-section">
          <label htmlFor="question">Question:</label>
          <textarea
            id="question"
            className="textarea"
            value={questionData.description}
            onChange={(e) => setQuestionData({ ...questionData, description: e.target.value })}
          />
        </div>

        <div className="button-section">
          <div className="button-box">
            <button className="clear-question-button" onClick={clearState}>Clear/Exit</button>
          </div>

          <div className="button-box-right" onClick={handleSetQuestion}>
            <button className="set-question-button">
              {mode === "create" ? "Submit Question" : "Update Question"}
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default QuestionPage;
