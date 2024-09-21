import React, { useState } from 'react';
import './QuestionPage.css'; 

const QuestionPage = () => {
  const [questions] = useState([
    { id: 1, title: "item1", complexity: "Easy", description: "Implement a function to detect if a linked list contains a cycle." },
    { id: 2, title: "item2", complexity: "Medium", description: "Description for item2 Description for item2Description for item2Description for item2" },
    { id: 3, title: "item3", complexity: "Hard", description: "Description for item3" },
    { id: 4, title: "item4", complexity: "Medium", description: "Description for item4" },
    { id: 5, title: "item5", complexity: "Hard", description: "Description for item5" },
    { id: 6, title: "item6", complexity: "Easy", description: "Description for item6" },
    { id: 7, title: "item7", complexity: "Medium", description: "Description for item7" },
    { id: 8, title: "item8", complexity: "Hard", description: "Description for item8" },
    { id: 9, title: "item9", complexity: "Easy", description: "Description for item9" },
    { id: 10, title: "item10", complexity: "Medium", description: "Description for item10" },
    { id: 11, title: "item11", complexity: "Hard", description: "Description for item11" },
    { id: 12, title: "item12", complexity: "Easy", description: "Description for item12" },
    { id: 13, title: "item13", complexity: "Medium", description: "Description for item13" },
    { id: 14, title: "item14", complexity: "Hard", description: "Description for item14" },
    { id: 15, title: "item15", complexity: "Easy", description: "Description for item15" },
    { id: 16, title: "item16", complexity: "Medium", description: "Description for item16" },
    { id: 17, title: "item17", complexity: "Hard", description: "Description for item17" },
    { id: 18, title: "item18", complexity: "Easy", description: "Description for item18" },
    { id: 19, title: "item19", complexity: "Medium", description: "Description for item19" },
    { id: 20, title: "item20", complexity: "Hard", description: "Description for item20" },
  ]);

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleTitleClick = (question) => {
    setSelectedQuestion(selectedQuestion === question ? null : question);
  };

  return (
    <div className="container mx-auto p-4 flex h-screen w-screen">
      <div className="flex-1 pr-4 overflow-y-auto"> {/* Question Table Section */}
        <h1 className="text-2xl font-bold mb-4">Question Repository</h1>
        <table className="min-w-full table-fixed bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 border-b w-1/2">Question Title</th> {/* Fixed width */}
              <th className="py-2 px-4 border-b w-1/4">Complexity</th> {/* Fixed width */}
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
      </div>

      <div className="flex-1 pl-4 overflow-y-auto max-w-md"> {/* Question Description Section */}
        {selectedQuestion ? (
          <div className="p-4 border border-gray-300 rounded-lg shadow-lg bg-white">
            <h2 className="font-bold text-xl">{selectedQuestion.title} - Description</h2>
            <p className="mt-2 text-gray-700">{selectedQuestion.description}</p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a question to see the description.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;
