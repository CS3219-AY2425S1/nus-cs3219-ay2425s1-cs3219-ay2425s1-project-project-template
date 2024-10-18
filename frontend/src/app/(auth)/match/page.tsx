"use client";

import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multiselect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  QuestionDifficulty,
  QuestionLanguages,
  QuestionTopics,
} from "@/types/find-match";
import { capitalizeWords } from "@/utils/string_utils";
import { useForm } from "react-hook-form";
import { Client as StompClient } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { send } from "process";

interface FindMatchFormOutput {
  questionDifficulty: string;
  preferredLanguages: string;
  questionTopics: string[];
}

interface FindMatchSocketMessage {
  userEmail: string;
  topics: string[];
  programmingLanguage: string[];
  difficulty: string;
}

const FindPeerHeader = () => {
  return (
    <div className="flex flex-col mt-8">
      <span className="text-h3 font-medium text-white">Find a Peer</span>
      <div className="flex flex-col text-white text-lg font-light">
        <span>
          Customize your experience by selecting multiple languages, difficulty
          levels,
        </span>
        <span>and question topics.</span>
      </div>
    </div>
  );
};

const FindPeer = () => {
  const [stompClient, setStompClient] = useState<StompClient | null>(null);
  const [socketMessages, setSocketMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false); // Manage connection state

  const SOCKET_URL =
    process.env["NEXT_PUBLIC_MATCHING_SERVICE_WEBSOCKET"] ||
    "http://localhost:3002/matching-websocket";

  const CURRENT_USER = uuidv4(); // TODO: Replace after merging Hafeez' new authentication PR

  // Function to trigger a connection to the web socket
  const connectWebSocket = () => {
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

        // Subscribe to a topic
        client.subscribe("/user/queue/matches", (message) => {
          console.log("Received message: ", message.body);
          setSocketMessages((prevMessages) => [...prevMessages, message.body]);
        });
      },
      onDisconnect: () => {
        console.log("STOMP connection closed");
      },
      onStompError: (error) => {
        console.error("STOMP error: ", error);
      },
    });

    client.activate();
    setStompClient(client);
  };

  const sendMatchRequest = (userFilter: FindMatchFormOutput) => {
    if (!stompClient || !isConnected) {
      console.log("STOMP client is not connected. Attempting to connect");
      try {
        connectWebSocket();
      } catch (error) {
        console.error("Failed to connect to STOMP client: ", error);
        return;
      }
    }

    // Repackage user filter data
    const userMatchRequest: FindMatchSocketMessage = {
      userEmail: CURRENT_USER,
      topic: userFilter.questionTopics[0], // to change
      programmingLanguage: userFilter.preferredLanguages[0],
      difficulty: userFilter.questionDifficulty,
    };

    console.log("Sending match request with data: ", userMatchRequest);

    if (!stompClient) {
      console.error(
        "STOMP client is not connected. Connection error encountered."
      );
      return;
    }

    stompClient.publish({
      destination: "/app/matchRequest",
      body: JSON.stringify(userMatchRequest),
    });
    console.log("Match request sent: ", CURRENT_USER);
  };

  const form = useForm({
    defaultValues: {
      questionDifficulty: QuestionDifficulty.MEDIUM.valueOf(),
      preferredLanguages: QuestionLanguages.PYTHON.valueOf(),
      questionTopics: "",
    },
  });

  const preferredLanguagesList = Object.values(QuestionLanguages).map((ql) => {
    return {
      label: capitalizeWords(ql),
      value: ql,
    };
  });

  const topicsList = Object.values(QuestionTopics)
    .map((qt) => {
      return {
        label: capitalizeWords(qt),
        value: qt,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

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
            <Select
              name="questionDifficulty"
              defaultValue={QuestionDifficulty.MEDIUM.valueOf()}
            >
              <SelectTrigger className="w-full bg-primary-800 text-white">
                <SelectValue placeholder="Choose a difficulty..." />
              </SelectTrigger>
              <SelectContent>
                {Object.values(QuestionDifficulty).map((qd) => (
                  <SelectItem value={qd} key={qd}>
                    <span className="capitalize">{qd}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
