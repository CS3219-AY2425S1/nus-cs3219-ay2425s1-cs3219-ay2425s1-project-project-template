import MatchingButton from "@/components/custom/MatchingOptions/MatchingButton";
import { SingleSelect } from "@/components/ui/single-select";
import { difficultyArray, topicArray } from "@/models/Question";
import { useState } from "react";

function MatchingOptions() {
  const [selectedTopic, setSelectedTopic] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);

  return (
    <div className="grid">
      <h1 className="grid-rows-1 my-2">Matching Options</h1>
      <SingleSelect
        className="grid-rows-1 my-2"
        options={topicArray}
        defaultValue={selectedTopic}
        onValueChange={setSelectedTopic}
        placeholder="Select Topic"
      />
      <div className="flex grid-rows-1 my-2">
        <SingleSelect
          options={difficultyArray}
          defaultValue={selectedDifficulty}
          onValueChange={setSelectedDifficulty}
          placeholder="Select Difficulty"
        />
      </div>
      <MatchingButton
        selectedDifficulty={selectedDifficulty}
        selectedTopic={selectedTopic}
      />
    </div>
  );
}

export default MatchingOptions;
