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

import { Question } from "@/types/questions";
import QuestionDescription from "@/components/questions/QuestionDescription";
import { SocketContext } from "@/context/SockerIOContext";
import { useUser } from "@/hooks/users";
import CodeEditor from "@/components/collaboration/CodeEditor";
import VoiceChat from "@/components/collaboration/VoiceChat";


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
  const [output, setOutput] = useState("Your output will appear here...");
  const [code, setCode] = useState(""); // Store the latest code
  const router = useRouter();
  const params = useParams();
  const roomId = params?.roomId;
  const API_BASE_URL = process.env.NEXT_PUBLIC_COLLABORATION_SERVICE_SOCKET_IO_URL;

  const socket = useContext(SocketContext);
  const { user } = useUser();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [otherUserDisconnect, setUserDisconnect] = useState<boolean>(false);
  const [otherUser, setOtherUser] = useState<string>("");

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const saveCodeAndEndSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/save-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, code })
      });
      
      if (!response.ok) throw new Error("Failed to save code");

      toast.success("Code saved successfully");
      router.push("/match"); // Redirect after saving
    } catch (error) {
      console.error("Error saving code:", error);
      toast.error("Error saving code");
    }
  };
  
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
      saveCodeAndEndSession(); // Call function to save code and redirect
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
      <div className="flex items-end justify-end mt-4">
        <Avatar isBordered color={isAvatarActive(otherUser)} name={otherUser} />
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
      <div className="flex">
        <div className="flex-[2_2_0%]">
          <QuestionDescription isCollab={true} question={mockQuestion} />
        </div>
        <div className="flex-[3_3_0%]">
          {/* Render the VoiceChat component */}
          <VoiceChat />
          
          {/* Render the CodeEditor */}
          <CodeEditor setOutput={setOutput} onCodeChange={handleCodeChange}/>
          <div style={{ marginTop: "20px" }}>
            <h3>Output:</h3>
            <pre>{output}</pre>
          </div>
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
                <p>The other user disconnected, the room will now be closed.</p>
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
    </>
  );
}
