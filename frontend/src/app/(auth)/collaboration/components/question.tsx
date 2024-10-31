import { fetchSingleLeetcodeQuestion } from "@/api/leetcode-dashboard";
import { NewQuestionData } from "@/types/find-match";
import { useEffect, useState } from "react";
import ComplexityPill from "./complexity";
import Pill from "./pill";
import { fetchSession } from "@/api/collaboration";
import { getBaseUserData } from "@/api/user";

const Question = ({ collabid }: { collabid: string }) => {
  const [question, setQuestion] = useState<NewQuestionData | null>(null);
  const [collaborator, setCollaborator] = useState<string | null>(null);
  const username = getBaseUserData().username;

  useEffect(() => {
    fetchSession(collabid).then(async (data) => {
      await fetchSingleLeetcodeQuestion(data.question_id.toString()).then(
        (data) => {
          setQuestion(data);
        }
      );

      setCollaborator(data.users.filter((user) => user !== username)[0]);
    });
  }, [collabid]);

  return (
    <div className="px-8 pb-20 pt-4">
      <h1 className="text-yellow-500 text-4xl font-bold pb-2">
        {question?.title}
      </h1>
      <span className="flex flex-wrap gap-1.5 my-1 pb-2">
        {question?.category.map((category) => (
          <Pill key={category} text={category} />
        ))}
        <ComplexityPill complexity={question?.complexity || ""} />
      </span>
      <h2 className="text-grey-300 text-s">
        Your collaborator: {collaborator}
      </h2>
      <p className="text-white py-8 text-md">{question?.description}</p>
    </div>
  );
};

export default Question;
