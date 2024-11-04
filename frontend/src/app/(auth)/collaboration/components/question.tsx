import { fetchSingleQuestion } from "@/api/question-dashboard";
import { NewQuestionData } from "@/types/find-match";
import { useEffect, useState } from "react";
import ComplexityPill from "./complexity";
import Pill from "./pill";
import { fetchSession } from "@/api/collaboration";
import { getUsername } from "@/api/user";
import { Button } from "@/components/ui/button";

const Question = ({ collabid }: { collabid: string }) => {
  const [question, setQuestion] = useState<NewQuestionData | null>(null);
  const [collaborator, setCollaborator] = useState<string | null>(null);
  const username = getUsername();

  const handleExit = () => {
    window.location.href = "/"; // We cannot use next/router, in order to trigger beforeunload listener
  };

  useEffect(() => {
    fetchSession(collabid).then(async (data) => {
      await fetchSingleQuestion(data.question_id.toString()).then((data) => {
        setQuestion(data);
      });

      setCollaborator(data.users.filter((user) => user !== username)[0]);
    });
  }, [collabid, username]);

  return (
    <div className="px-12 pb-20">
      <div className="grid grid-rows-2">
        <div className="grid grid-rows-1 grid-cols-[75%_25%]">
          <div className="flex flex-col justify-end">
            <h1 className="text-yellow-500 text-4xl font-bold pb-2">
              {question?.title}
            </h1>
            <span className="flex flex-wrap gap-1.5 my-1 pb-2">
              {question?.category.map((category) => (
                <Pill key={category} text={category} />
              ))}
              <ComplexityPill complexity={question?.complexity || ""} />
            </span>
            <h2 className="text-grey-300 text-s pt-3 leading-[0]">
              Your collaborator: {collaborator}
            </h2>
          </div>
          <Button
            className="self-end"
            variant="destructive"
            onClick={handleExit}
          >
            Exit Room
          </Button>
        </div>
        <p className="text-white py-8 text-md">{question?.description}</p>
        <div>{/* Add chat here */}</div>
      </div>
    </div>
  );
};

export default Question;
