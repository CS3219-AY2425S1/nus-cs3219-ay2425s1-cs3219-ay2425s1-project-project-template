import { fetchSingleLeetcodeQuestion } from "@/api/leetcode-dashboard";
import { NewQuestionData } from "@/types/find-match";
import { useEffect, useRef, useState } from "react";
import ComplexityPill from "./complexity";
import Pill from "./pill";
import { fetchSession } from "@/api/collaboration";
import { getBaseUserData } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Client as StompClient } from "@stomp/stompjs";
import "react-chat-elements/dist/main.css";
import { Input, MessageList } from "react-chat-elements";
import SockJS from "sockjs-client";

const CHAT_SOCKET_URL =
  process.env["NEXT_PUBLIC_CHAT_SERVICE_WEBSOCKET"] ||
  "http://localhost:3007/chat-websocket";

interface Message {
  position: "left" | "right";
  type: "text";
  title: string;
  text: string;
}

const lorem =
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";

const sampleMessage = {
  position: "right",
  type: "text",
  title: "You",
  text: "Hello, how can I help you?",
};

const Question = ({ collabid }: { collabid: string }) => {
  const [question, setQuestion] = useState<NewQuestionData | null>(null);
  const [collaborator, setCollaborator] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const stompClientRef = useRef<StompClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const userID = getBaseUserData().username; // Change me
    setUserID(userID);

    const socket = new SockJS(`${CHAT_SOCKET_URL}?userID=${userID}`); // BUG: This should NOT be username, but userID. Use this for now because we can't retrieve the collaborator's ID.
    const client = new StompClient({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("STOMP connection established");
        setIsConnected(true);

        client.subscribe("/user/queue/chat", (message) => {
          console.log("Received message", message);
          const messageReceived = message.body;
          console.log(messageReceived);
          console.log(collaborator);
          const newMessage = {
            position: "left",
            type: "text",
            title: collaborator!,
            text: messageReceived,
          };
          setMessages((prev) => [...prev, newMessage]);
        });
      },
      onDisconnect: () => {
        console.log("STOMP connection lost");
        setIsConnected(false);
      },
      onStompError: (error) => {
        console.log("STOMP error", error);
      },
    });
    stompClientRef.current = client;

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [collaborator]);

  const username = getBaseUserData().username;

  const handleExit = () => {
    window.location.href = "/"; // We cannot use next/router, in order to trigger beforeunload listener
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!inputMessage) return;
    console.log(inputMessage);
    setMessages((prev) => [
      ...prev,
      { position: "right", title: username!, text: inputMessage, type: "text" },
    ]);

    if (stompClientRef.current && isConnected) {
      const message = {
        message: inputMessage,
        collabID: collabid,
        targetID: collaborator, // BUG: Should be the other user's ID, not username. Temporary workaround.
      };
      stompClientRef.current.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(message),
      });
      setInputMessage("");
    } else {
      console.error("STOMP client not connected");
    }
  };

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
    <div className="px-12 grid grid-rows-[20%_45%_35%] gap-5 grid-cols-1 h-full items-start">
      <div className="mt-10 row-span-1 grid grid-rows-1 grid-cols-[75%_25%] w-full">
        <div className="flex flex-col">
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
        <Button className="self-end" variant="destructive" onClick={handleExit}>
          Exit Room
        </Button>
      </div>
      {/* <p className="text-white py-8 text-md">{question?.description}</p> */}
      <p className="row-span-1 text-primary-300 text-md max-h-[100%] overflow-y-auto flex flex-col gap-2 bg-primary-800 p-3 rounded-md">
        <span className="text-yellow-500 font-bold">Question Description</span>
        <p>{lorem}</p>
      </p>
      <div className="row-span-1 flex flex-col bg-primary-800 rounded-md max-h-[80%] overflow-y-auto">
        <MessageList
          className="overflow-y-auto"
          lockable={true}
          dataSource={messages}
        />
        <Input
          placeholder="Type here..."
          value={inputMessage}
          rightButtons={<Button onClick={handleClick}>Send</Button>}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            console.log(e);
            if (e.key === "Enter") {
              handleClick(e);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Question;
