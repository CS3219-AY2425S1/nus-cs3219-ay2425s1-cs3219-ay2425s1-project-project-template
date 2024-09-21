import React, { useState } from 'react';

const QuestionPage = () => {
  const [questions] = useState([
    { id: 1, title: "item1", complexity: "Easy", description: "Description for item1" },
    { id: 2, title: "item2", complexity: "Medium", description: "Description for item2" },
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
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">Question Repository</h1>
      <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Question Title</th>
              <th className="py-2 px-4 border-b">Complexity</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.id}>
                <td className="py-2 px-4 border-b cursor-pointer" onClick={() => handleTitleClick(question)}>
                  {question.title}
                </td>
                <td className="py-2 px-4 border-b">{question.complexity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedQuestion && (
        <div className="mt-4 p-4 border border-gray-300">
          <h2 className="font-bold">{selectedQuestion.title} - Description</h2>
          <p>{selectedQuestion.description}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
