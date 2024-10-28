import MatchingButton from "@/components/custom/MatchingOptions/MatchingButton";
import { SingleSelect } from "@/components/ui/single-select";
import { difficultyArray, topicArray } from "@/models/Question";
import { useState } from "react";

function MatchingOptions() {
  const [selectedTopic, setSelectedTopic] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);

  return (
    <div className="grid max-w-full p-4 overflow-hidden">
      <h1 className="my-2">Matching Options</h1>
      <SingleSelect
        className="my-2"
        options={topicArray}
        defaultValue={selectedTopic}
        onValueChange={setSelectedTopic}
        placeholder="Select Topic"
      />
      <SingleSelect
        className="my-2"
        options={difficultyArray}
        defaultValue={selectedDifficulty}
        onValueChange={setSelectedDifficulty}
        placeholder="Select Difficulty"
      />
      <MatchingButton
        selectedDifficulty={selectedDifficulty}
        selectedTopic={selectedTopic}
      />
    </div>
  );
}

export default MatchingOptions;
