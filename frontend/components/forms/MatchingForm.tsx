import { useRef, useState, ReactNode } from "react";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { v4 } from "uuid";

import ProgrammingLanguageSelectDropdown from "../matching/ProgrammingLanguageSelectDropdown";
import QuestionDifficultyDropDown from "../matching/DifficultyDropdown";
import TopicSelection from "../matching/TopicSelection";
import MatchingTimer from "../matching/MatchingTimer";

import { useAddUserToMatch } from "@/hooks/api/matching";
import { UserMatchRequest } from "@/types/match";

const CARD_STYLES = "w-9/12 gap-y-7 flex mx-auto flex-col justify-center p-16";

export default function MatchingForm() {
  const questionDifficultyRef = useRef<string[]>([]);
  const programmingLanguagesRef = useRef<string[]>([]);
  const topicsRef = useRef<string[]>([]);
  const [isMatching, setIsMatching] = useState<boolean>(false);

  const onSelectQuestionDifficulty = (difficulties: string[]) => {
    questionDifficultyRef.current = difficulties;
  };

  const onSelectProgrammingLanguages = (languages: string[]) => {
    programmingLanguagesRef.current = languages;
  };

  const onSelectTopics = (topics: string[]) => {
    topicsRef.current = topics;
  };

  const onSuccess = () => alert("Successfully Matched A");

  const { mutate, isPending, isError, error } = useAddUserToMatch(onSuccess);

  const onSubmit = () => {
    const userId = v4();
    const socketId = v4();
    const userMatchRequest: UserMatchRequest = {
      user_id: userId,
      socket_id: socketId,
      difficulty_levels: questionDifficultyRef.current,
      categories: topicsRef.current,
      programming_languages: programmingLanguagesRef.current,
      generalize_languages: false,
    };

    mutate(userMatchRequest);
    setIsMatching(true);
  };

  const onCancel = () => setIsMatching(false);

  let content: ReactNode;

  if (isMatching) {
    content = <MatchingTimer seconds={5} onCancel={onCancel} />;
  } else {
    content = (
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

  return content;
}
