import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import axios from "axios";
import ChatComponent from "../chat/ChatComponent";

interface Question {
  questionId: string;
  title: string;
  difficulty: string;
}

interface QuestionSideBarProps {
  onSelectQuestion: (questionId: string) => void;
}

const QuestionSideBar: React.FC<QuestionSideBarProps> = ({
  onSelectQuestion,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/questions")
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => console.error("Failed to fetch questions", error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (token && email) {
      axios
        .get("http://localhost:5001/room/data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (response) => {
          setRoomId(response.data.roomId);

          // Extract user IDs and fetch each user's data to find a matching email
          const userIds = Object.keys(response.data.users);
          console.log("User IDs:", userIds);
          let currentUserId = "";

          // Fetch each user's data only if necessary
          for (const id of userIds) {
            if (currentUserId) break;
            try {
              console.log(`Fetching user data for ID ${id}`);
              const userResponse = await axios.get(
                `http://localhost:3001/users/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              console.log("Full user data response:", userResponse.data);

              console.log(
                `Fetched email: ${userResponse.data.data.email}, Stored email: ${email}`
              );

              // Check if the email matches
              if (userResponse.data.data.email === email) {
                currentUserId = id;
                break; // Stop the loop as we found the current user
              }
            } catch (error) {
              console.error(`Failed to fetch user data for ID ${id}`, error);
            }
          }

          if (currentUserId) {
            setUserId(currentUserId);
          } else {
            console.error("Current user ID not found");
          }
        })
        .catch((error) => console.error("Failed to fetch room data", error));
    } else {
      console.error("No token or email found in localStorage");
    }
  }, []);

  return (
    <Box
      width={isOpen ? "500px" : 0}
      transition="width 0.3s"
      p={isOpen ? 4 : 0}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      borderColor="gray.200"
      bg="grey.50"
      height="100vh"
    >
      <Tabs>
        <TabList>
          <Tab>Questions</Tab>
          <Tab>Chat</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Button onClick={() => setIsOpen(!isOpen)} mb={4}>
              {isOpen ? "Close" : "Open"} Questions
            </Button>
            {isOpen && questions.length > 0 && (
              <List spacing={3}>
                {questions.map((question) => (
                  <ListItem key={question.questionId}>
                    <Button
                      variant="link"
                      onClick={() => onSelectQuestion(question.questionId)}
                      color={
                        question.difficulty === "Easy"
                          ? "green.500"
                          : question.difficulty === "Medium"
                          ? "orange.500"
                          : "red.500"
                      }
                    >
                      {question.title} - {question.difficulty}
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
            {isOpen && questions.length === 0 && (
              <Box>No questions available.</Box>
            )}
          </TabPanel>
          <TabPanel>
            {userId && roomId ? (
              <ChatComponent userId={userId} roomId={roomId} />
            ) : (
              <Box>Loading chat...</Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default QuestionSideBar;
