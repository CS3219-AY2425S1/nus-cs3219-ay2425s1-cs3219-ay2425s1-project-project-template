import { useState } from "react";

const Questions = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  // Function to toggle the description for a specific question
  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };
  const questions = [
    {
      id: 1,
      title: "Reverse a String",
      description: `Write a function that reverses a string.
                    The input string is given as an array of characters s.
                    You must do this by modifying the input array in-place with O(1) extra memory.

                    Example 1:
                    Input: s = ["h","e","l","l","o"]
                    Output: ["o","l","l","e","h"]

                    Example 2:
                    Input: s = ["H","a","n","n","a","h"]
                    Output: ["h","a","n","n","a","H"]

                    Constraints:
                    1 <= s.length <= 10^5
                    s[i] is a printable ascii character.`,
      category: "Strings, Algorithm",
      complexity: "Easy",
    },
    {
      id: 2,
      title: "Data Structures",
      description: `Write a function that reverses a string.
                    The input string is given as an array of characters s.
                    You must do this by modifying the input array in-place with O(1) extra memory.

                    Example 1:
                    Input: s = ["h","e","l","l","o"]
                    Output: ["o","l","l","e","h"]

                    Example 2:
                    Input: s = ["H","a","n","n","a","h"]
                    Output: ["h","a","n","n","a","H"]

                    Constraints:
                    1 <= s.length <= 10^5
                    s[i] is a printable ascii character.`,
      category: "Strings, Algorithm",
      complexity: "Easy",
    },
  ];

  return (
    <div className="h-96 w-full rounded-3xl bg-[#191919] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Interview Questions</h2>
        <button className="rounded-full bg-lime-300 px-4 py-2 text-black">
          <h1>Start Practice</h1>
        </button>
      </div>
      <div className="space-y-4">
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
                  className={`rounded-full px-4 py-1 text-sm font-light ${
                    item.complexity === "Easy"
                      ? "bg-lime-100/30 text-lime-400"
                      : item.complexity === "Medium"
                        ? "bg-yellow-100 text-yellow-600"
                        : item.complexity === "Hard"
                          ? "bg-red-100 text-red-600"
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
                <p className="mt-4 text-sm font-light text-gray-300/30">
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
