import React, { useState } from "react";
import useQuestionDifficulties from "../../../components/hooks/useQuestionDifficulties";
import useQuestionTopics from "../../../components/hooks/useQuestionTopics";

const MockMatch: React.FC = () => {
  const { difficulties } = useQuestionDifficulties();
  const { topics } = useQuestionTopics();

  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDifficulty(event.target.value);
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopic(event.target.value);
  };

  const handleMatchMe = async () => {
    if (!selectedDifficulty || !selectedTopic) {
      alert("Please select a difficulty and topic!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/match-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ difficulty: selectedDifficulty, topic: selectedTopic }),
      });

      if (!response.ok) {
        throw new Error("Error matching");
      }

      const data = await response.json();
      alert(`Matched with ${data.opponentUsername}!`);
    } catch (error) {
      alert("Error matching");
    }
  };

  return (
    <div>
      <h2>MockMatch</h2>
      <label>
        Difficulty:
        <select value={selectedDifficulty} onChange={handleDifficultyChange}>
          <option value="">Select difficulty</option>
          {difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Topic:
        <select value={selectedTopic} onChange={handleTopicChange}>
          <option value="">Select topic</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </label>
      <br />
      <button onClick={handleMatchMe}>Match me!</button>
    </div>
  );
};

export default MockMatch;

