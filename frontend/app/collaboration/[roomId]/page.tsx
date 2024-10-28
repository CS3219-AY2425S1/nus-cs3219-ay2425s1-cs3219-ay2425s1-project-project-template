import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";

import DefaultLayout from "@/layouts/default";
import { Question } from "@/types/questions";
import QuestionDescription from "@/components/questions/QuestionDescription";
import { SocketProvider, SocketContext } from "@/context/SockerIOContext";

const mockQuestion: Question = {
  title: "Fibonacci Number",
  complexity: "Easy",
  category: ["Recursion", "Algorithms"],
  description:
    "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n). ",
  examples: "Input: n = 2; Output: 1. Input: n = 4; Output: 3.",
  constraints: "0 <= n <= 30.",
};

const CollaborationPage = () => {

  return (
    <SocketProvider>
      <DefaultLayout isLoggedIn={true}>
        <div className="flex items-end justify-end mt-4">
          <Avatar />
          <Avatar />
          <Button color="danger">Exit Session</Button>
        </div>
        <div className="flex">
          <div className="flex-[2_2_0%]">
            <QuestionDescription isCollab={true} question={mockQuestion} />
          </div>
          <div className="flex-[3_3_0%]">
            <h1>Placeholder for Code Editor</h1>
          </div>
        </div>
      </DefaultLayout>
    </SocketProvider>
  );
};

export default CollaborationPage;
