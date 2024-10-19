"use client";

import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multiselect";
import MoonLoader from "react-spinners/MoonLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionDifficulty, QuestionLanguages } from "@/types/find-match";
import { useForm } from "react-hook-form";
import { Client as StompClient } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FindPeerHeader from "@/app/(auth)/components/match/FindPeerHeader";
import {
  preferredLanguagesList,
  questionDifficulties,
  topicsList,
} from "@/utils/constants";
import Swal from "sweetalert2";
import { createRoot } from "react-dom/client";

interface FindMatchFormOutput {
  questionDifficulties: string[];
  preferredLanguages: string[];
  questionTopics: string[];
}

interface FindMatchSocketMessage {
  userEmail: string;
  topics: string[];
  programmingLanguages: string[];
  difficulties: string[];
}

interface FindMatchSocketMessageResponse {
  matchedUserEmail: string;
}

const showLoadingSpinner = (onCancel: () => void) => {
  Swal.fire({
    title: "Finding a match...",
    html: `
      <div id="spinner-container" class="flex flex-col items-center p-5">
      </div>
    `,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showCancelButton: true,
    cancelButtonText: "Cancel",
    showConfirmButton: false,
    didOpen: () => {
      const container = document.getElementById("spinner-container");
      if (container) {
        const root = createRoot(container);
        root.render(<MoonLoader size={60} color={"#3498db"} />);
      }
    },
  }).then((result) => {
    // Handle cancel button click
    if (result.dismiss === Swal.DismissReason.cancel) {
      onCancel();
    }
  });
};

const closeLoadingSpinner = () => {
  Swal.close();
};

const SOCKET_URL =
  process.env["NEXT_PUBLIC_MATCHING_SERVICE_WEBSOCKET"] ||
  "http://localhost:3005/matching-websocket";

const CURRENT_USER = uuidv4(); // TODO: Replace after merging Hafeez' new authentication PR

const TIMEOUT_TIMER = 500000; // in seconds

const FindPeer = () => {
  const stompClientRef = useRef<StompClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketMessages, setSocketMessages] = useState<string[]>([]);

  const cancelSocketConnection = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      console.log("WebSocket connection canceled by user.");
    }
    closeLoadingSpinner();
  };

  const makeSocketConnection = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const socket = new SockJS(SOCKET_URL);
      const client = new StompClient({
        webSocketFactory: () => socket,
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        onConnect: () => {
          console.log("STOMP connection established");
          setIsConnected(true);

          client.subscribe("/user/queue/matches", (message) => {
            console.log("Received message: ", message.body);
            setSocketMessages((prevMessages) => [
              ...prevMessages,
              message.body,
            ]);
          });

          client.subscribe("/user/queue/requestRejection", (message) => {
            console.log("Received message: ", message.body);
            setSocketMessages((prevMessages) => [
              ...prevMessages,
              message.body,
            ]);
          });

          stompClientRef.current = client;
          resolve();
        },
        onDisconnect: () => {
          console.log("STOMP connection closed");
          setIsConnected(false);
        },
        onStompError: (error) => {
          console.error("STOMP error: ", error);
          reject(error);
        },
      });

      client.activate();
    });
  };

  const sendMatchRequest = async (userFilter: FindMatchFormOutput) => {
    if (stompClientRef.current == null || !isConnected) {
      console.log("STOMP client not connected. Attempting to connect...");
      await makeSocketConnection();
    }

    // Repackage user filter data
    // TODO: Change this to use multiselect later
    const userMatchRequest: FindMatchSocketMessage = {
      userEmail: CURRENT_USER,
      topics: userFilter.questionTopics,
      programmingLanguages: userFilter.preferredLanguages,
      difficulties: userFilter.questionDifficulties,
    };

    console.log("Sending match request with data: ", userMatchRequest);

    const client = stompClientRef.current; // Use the ref to get the client instance

    if (client?.connected !== true) {
      console.error(
        "STOMP client is not connected. Connection error encountered."
      );
      return;
    }

    client.publish({
      destination: "/app/matchRequest",
      body: JSON.stringify(userMatchRequest),
    });
    console.log("Match request sent: ", CURRENT_USER);

    showLoadingSpinner(cancelSocketConnection);

    const timeout = setTimeout(() => {
      stompClientRef.current?.deactivate();
      Swal.update({
        title: "Timeout",
        text: "We could not find a match for you. Perhaps try a new set of filters? :(",
        icon: "error",
        showCloseButton: true,
      });
    }, TIMEOUT_TIMER * 1000);

    try {
      client.subscribe("/user/queue/requestRejection", (message) => {
        const response: String = message.body;
        console.log("Received message: ", response);
        closeLoadingSpinner();
        clearTimeout(timeout);
        Swal.fire(
          "A new Match Request cannot be sent!",
          `${response}`,
          "error"
        );
        client.deactivate();
      });

      client.subscribe("/user/queue/matches", (message) => {
        const response: FindMatchSocketMessageResponse = JSON.parse(
          message.body
        );
        console.log("Received message: ", response);
        const matchedUserEmail = response.matchedUserEmail;
        closeLoadingSpinner();
        clearTimeout(timeout);
        Swal.fire(
          "Match Found!",
          `We found a match for you! You have been matched with ${matchedUserEmail}.`,
          "success"
        );
        client.deactivate();
      });
    } catch (error) {
      console.error("Error subscribing to /user/queue/matches: ", error);
      closeLoadingSpinner();
      clearTimeout(timeout);

      Swal.fire(
        "Error",
        "An error occurred while trying to find a match for you. Please try again later.",
        "error"
      );
    }
  };

  const form = useForm({
    defaultValues: {
      questionDifficulties: QuestionDifficulty.MEDIUM.valueOf(),
      preferredLanguages: QuestionLanguages.PYTHON.valueOf(),
      questionTopics: "",
    },
  });

  const onSubmit = (data: FindMatchFormOutput) => {
    sendMatchRequest(data);
  };

  return (
    <Container>
      <FindPeerHeader />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-[1fr_8fr] grid-rows-3 mt-5 mb-14 gap-y-10">
            <span className="text-sm text-primary-400 self-center">
              Difficulty
            </span>
            <FormField
              control={form.control}
              name="questionDifficulties"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiSelect
                      options={questionDifficulties}
                      onValueChange={field.onChange}
                      placeholder="Select options"
                      variant="inverted"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <span className="text-sm text-primary-400">
              Preferred Languages
            </span>
            <FormField
              control={form.control}
              name="preferredLanguages"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiSelect
                      options={preferredLanguagesList}
                      onValueChange={field.onChange}
                      placeholder="Select options"
                      variant="inverted"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <span className="text-sm text-primary-400">Topics</span>
            <FormField
              control={form.control}
              name="questionTopics"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiSelect
                      options={topicsList}
                      onValueChange={field.onChange}
                      placeholder="Select options"
                      variant="inverted"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="pl-10 pr-10">
            Find Interview Peer
          </Button>
        </form>
      </Form>
    </Container>
  );
};

export default FindPeer;
