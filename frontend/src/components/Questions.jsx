import { useEffect, useState } from "react";
import { getQuestions } from "../services/QuestionService";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questions = await getQuestions();
        setQuestions(questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="w-full rounded-3xl border border-gray-300/30 bg-[#191919] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Interview Questions
        </h2>
      </div>
      <div className="space-y-2">
        {questions.map((item) => (
          <div
            key={item.id}
            className="flex cursor-pointer items-center rounded-2xl bg-gray-100/10 p-4"
            onClick={() => toggleQuestion(item.id)}
          >
            <div className="flex-grow">
              <div className="flex flex-row items-center justify-between">
                <h3 className="font-semibold">{item.title}</h3>
                <h3
                  className={`rounded-full px-4 py-1 text-sm font-light text-black ${
                    item.complexity === "Easy"
                      ? "bg-lime-300"
                      : item.complexity === "Medium"
                        ? "bg-yellow-400"
                        : item.complexity === "Hard"
                          ? "bg-red-600"
                          : ""
                  }`}
                >
                  {item.complexity}
                </h3>
              </div>
              {item.category && (
                <p className="text-sm text-gray-300/30">
                  Category: {item.category}
                </p>
              )}
              {openQuestion === item.id && (
                <p className="mt-4 text-sm font-light text-white">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
