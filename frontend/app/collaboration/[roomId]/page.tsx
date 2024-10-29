"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { toast } from "react-toastify";

import DefaultLayout from "@/layouts/default";
import { Question } from "@/types/questions";
import QuestionDescription from "@/components/questions/QuestionDescription";
import { SocketContext } from "@/context/SockerIOContext";
import { useUser } from "@/hooks/users";
import { ToastContainer } from "react-toastify";

const mockQuestion: Question = {
  title: "Fibonacci Number",
  complexity: "Easy",
  category: ["Recursion", "Algorithms"],
  description:
    "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n). ",
  examples: "Input: n = 2; Output: 1. Input: n = 4; Output: 3.",
  constraints: "0 <= n <= 30.",
};

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.roomId;

  const socket = useContext(SocketContext);
  const { user } = useUser();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [otherUserDisconnect, setUserDisconnect] = useState<boolean>(false);
  const [otherUser, setOtherUser] = useState<string>("");

  const socketListeners = () => {
    socket?.on("user-disconnect", () => {
      setUserDisconnect(true);
      setOtherUser("");
    });

    socket?.on("waiting-for-other-user-end", () => {
      toast.info(`Waiting for other user to click exit.`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
      });
    });

    socket?.on("both-users-agreed-end", () => {
      router.push("/match");
    });
  };

  const handleEndSession = (): void => {
    socket?.emit("user-agreed-end", roomId, user?.id);
  };

  useEffect(() => {
    if (socket && roomId && user) {
      socket.emit("join-room", roomId, user?.username);

      socket.on("user-join", (otherUser: string) => {
        if (otherUser !== user?.username) {
          toast.info(`User ${otherUser} has joined the room`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
          });
          setOtherUser(otherUser);
        }
      });
    }

    socketListeners();
  }, [socket, roomId, user]);

  const isAvatarActive = (otherUser: string) => {
    if (otherUser) {
      return "success";
    } else {
      return "default";
    }
  };

  return (
    <>
      <DefaultLayout isLoggedIn={true}>
        <div className="flex items-end justify-end mt-4">
          <Avatar
            isBordered
            color={isAvatarActive(otherUser)}
            name={otherUser}
          />
          <Avatar
            isBordered
            className="mx-8"
            color="success"
            name={user?.username}
          />
          <Button className="mx-8" color="danger" onPress={onOpen}>
            Exit Session
          </Button>
        </div>
        <div className="flex flex-row">
          <section className="flex-[2_2_0%]">
            <QuestionDescription isCollab={true} question={mockQuestion} />
          </section>
          <div className="flex-[3_3_0%]">
            <h1>Placeholder for code editor</h1>
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
                    No
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      handleEndSession();
                      onClose();
                    }}
                  >
                    Yes, Exit
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          hideCloseButton={true}
          isDismissable={false}
          isOpen={otherUserDisconnect}
        >
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Other user disconnected
                </ModalHeader>
                <ModalBody>
                  <p>
                    The other user disconnected, the room will now be closed.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onPress={() => {
                      router.push("/match");
                    }}
                  >
                    Back to match
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </DefaultLayout>
    </>
  );
}
