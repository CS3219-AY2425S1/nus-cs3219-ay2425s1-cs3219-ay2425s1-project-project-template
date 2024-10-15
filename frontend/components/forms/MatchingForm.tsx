import { useRef } from "react";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

import ProgrammingLanguageSelectDropdown from "../matching/ProgrammingLanguageSelectDropdown";
import QuestionDifficultyDropDown from "../matching/DifficultyDropdown";
import TopicSelection from "../matching/TopicSelection";

const CARD_STYLES = "w-9/12 gap-y-7 flex mx-auto flex-col justify-center p-16";

export default function MatchingForm() {
  const questionDifficultyRef = useRef<string[]>([]);
  const programmingLanguagesRef = useRef<string[]>([]);
  const topicsRef = useRef<string[]>([]);

  const onSelectQuestionDifficulty = (difficulties: string[]) => {
    questionDifficultyRef.current = difficulties;
  };

  const onSelectProgrammingLanguages = (languages: string[]) => {
    programmingLanguagesRef.current = languages;
  };

  const onSelectTopics = (topics: string[]) => {
    topicsRef.current = topics;
  };
  const onSubmit = () => {
    console.log(questionDifficultyRef.current);
    console.log(topicsRef.current);
    console.log(programmingLanguagesRef.current);
  };

  return (
    <Card className={CARD_STYLES}>
      <h2 className="text-4xl">Session Details</h2>
      <ul className="flex flex-col gap-y-5 items-center">
        <li className="w-full">
          <QuestionDifficultyDropDown onSelect={onSelectQuestionDifficulty} />
        </li>
        <li className="w-full">
          <ProgrammingLanguageSelectDropdown
            onSelect={onSelectProgrammingLanguages}
          />
        </li>
        <li className="w-full">
          <TopicSelection onSelect={onSelectTopics} />
        </li>
      </ul>
      <div className="flex items-center justify-end gap-5">
        <Button color="danger">Cancel</Button>
        <Button color="warning" onPress={onSubmit}>
          Submit
        </Button>
      </div>
    </Card>
  );
}
