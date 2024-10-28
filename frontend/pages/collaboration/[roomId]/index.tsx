import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import { toast, ToastContainer } from "react-toastify";

import DefaultLayout from "@/layouts/default";
import { Question } from "@/types/questions";
import QuestionDescription from "@/components/questions/QuestionDescription";
import { SocketProvider, SocketContext } from "@/context/SockerIOContext";
import { useUser } from "@/hooks/users";

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
  const router = useRouter();
  const { socket } = useContext(SocketContext);
  const { user } = useUser();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { roomId } = router.query;

  const handleEndSession = (): void => {
    socket?.emit("user-agreed-on", roomId, user?.id);
  };

  useEffect(() => {
    console.log("use Effect fired");
    socket?.emit("join-room", roomId, user?.username);

    socket?.on("user-join", (otherUser: string) => {
      toast.info(`User ${otherUser} has joined the room`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
      });
    });
  }, [socket, roomId]);

  return (
    <SocketProvider>
      <DefaultLayout isLoggedIn={true}>
        <ToastContainer />
        <div className="flex items-end justify-end mt-4">
          <Avatar />
          <Avatar />
          <Button color="danger" onPress={onOpen}>
            Exit Session
          </Button>
        </div>
        <div className="flex">
          <div className="flex-[2_2_0%]">
            <QuestionDescription isCollab={true} question={mockQuestion} />
          </div>
          <div className="flex-[3_3_0%]">
            <h1>Placeholder for Code Editor</h1>
          </div>
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Exit Session
                </ModalHeader>
                <ModalBody>
                  <p>Did both users agree to exit the session?</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={handleEndSession}>
                    Exit
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </DefaultLayout>
    </SocketProvider>
  );
};

export default CollaborationPage;
