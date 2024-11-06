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
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import ChatComponent from "../chat/ChatComponent";

interface Question {
  questionId: string,
  title: string,
  description: string,
  category: string[],
  difficulty: string,
  link: string,
}

interface QuestionSideBarProps {
  assignedQuestionId: string;
  userId: string;
  roomId: string;
}

const QuestionSideBar: React.FC<QuestionSideBarProps> = ({ assignedQuestionId, userId, roomId }) => {
  // const [questions, setQuestions] = useState<Question[]>([]);
  // const [isOpen, setIsOpen] = useState(true);
  // const [userId, setUserId] = useState<string>("");
  // const [roomId, setRoomId] = useState<string>("");
  const [assignedQuestion, setAssignedQuestion] = useState<Question | null>(null)

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8080/api/questions")
  //     .then((response) => {
  //       setQuestions(response.data);
  //     })
  //     .catch((error) => console.error("Failed to fetch questions", error));
  // }, []);

  useEffect(() => {
    if (assignedQuestionId) {
      axios.get(`http://localhost:8080/api/questions/${assignedQuestionId}`).then(response => {
        console.log("Fetched question details:", response.data)
        setAssignedQuestion(response.data)
      }).catch(error => console.error("Failed to fetch question details", error))
    }
  }, [assignedQuestionId])

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const email = localStorage.getItem("email");

  //   if (token && email) {
  //     axios
  //       .get("http://localhost:5001/room/data", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then(async (response) => {
  //         setRoomId(response.data.roomId);

  //         // Extract user IDs and fetch each user's data to find a matching email
  //         const userIds = Object.keys(response.data.users);
  //         console.log("User IDs:", userIds);
  //         let currentUserId = "";

  //         // Fetch each user's data only if necessary
  //         for (const id of userIds) {
  //           if (currentUserId) break;
  //           try {
  //             console.log(`Fetching user data for ID ${id}`);
  //             const userResponse = await axios.get(
  //               `http://localhost:3001/users/${id}`,
  //               {
  //                 headers: {
  //                   Authorization: `Bearer ${token}`,
  //                 },
  //               }
  //             );
  //             console.log("Full user data response:", userResponse.data);

  //             console.log(
  //               `Fetched email: ${userResponse.data.data.email}, Stored email: ${email}`
  //             );

  //             // Check if the email matches
  //             if (userResponse.data.data.email === email) {
  //               currentUserId = id;
  //               break; // Stop the loop as we found the current user
  //             }
  //           } catch (error) {
  //             console.error(`Failed to fetch user data for ID ${id}`, error);
  //           }
  //         }

  //         if (currentUserId) {
  //           setUserId(currentUserId);
  //         } else {
  //           console.error("Current user ID not found");
  //         }
  //       })
  //       .catch((error) => console.error("Failed to fetch room data", error));
  //   } else {
  //     console.error("No token or email found in localStorage");
  //   }
  // }, []);

  return (
    <Box
      // width={isOpen ? "500px" : 0}
      transition="width 0.3s"
      // p={isOpen ? 4 : 0}
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
            <Box>
              {!assignedQuestionId ? (
                <Text color="red.500">Error: No question ID provided.</Text>
              ) : (
                <Box mb={4} p={4} bg="white" borderRadius="md">
                  <Text fontSize="xl" fontWeight="bold">{assignedQuestion?.title}</Text>
                  <Text color="gray.600">Category: {assignedQuestion?.category.join(', ')}</Text>
                  <Text color="gray.600">Difficulty: {assignedQuestion?.difficulty}</Text>
                  <Text color="gray.600">{assignedQuestion?.description}</Text>
                </Box>
              )}
            </Box>
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

{/*
const QuestionSideBar: React.FC<QuestionSideBarProps> = ({ assignedQuestionId }) => {
  const [assignedQuestion, setAssignedQuestion] = useState<Question | null>(null)

  useEffect(() => {
    if (assignedQuestionId) {
      axios.get(`http://localhost:8080/api/questions/${assignedQuestionId}`).then(response => {
        console.log("Fetched question details:", response.data)
        setAssignedQuestion(response.data)
      }).catch(error => console.error("Failed to fetch question details", error))
    }
  }, [assignedQuestionId])


  return (
    <Box>
      {!assignedQuestionId ? (
        <Text color="red.500">Error: No question ID provided.</Text>
      ) : (
        <Box mb={4} p={4} bg="white" borderRadius="md">
          <Text fontSize="xl" fontWeight="bold">{assignedQuestion?.title}</Text>
          <Text color="gray.600">Category: {assignedQuestion?.category.join(', ')}</Text>
          <Text color="gray.600">Difficulty: {assignedQuestion?.difficulty}</Text>
          <Text color="gray.600">{assignedQuestion?.description}</Text>
        </Box>
      )}
    </Box>
  )
}
*/}