import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Avatar, Text, Box, Flex, VStack, HStack, border } from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import { useUserContext } from "../../context/UserContext";
import { COMPLEXITIES } from "../../constants/data";
import Dropdown from "./Dropdown";
import { useQuesApiContext } from "../../context/ApiContext";
import axios from "axios";

const DashboardView = () => {
  const navigate = useNavigate();
  const api = useQuesApiContext();
  const user = useUserContext().user;

  // State for selected topic, difficulty, and topics list
  const services: string[] = ["View Questions", "Let's Match"];
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [topics, setTopics] = useState<string[]>([]);

  // Function to fetch topics
  const fetchTopics = async (): Promise<string[]> => {
    try {
      const response = await api.get<{ message: string; topics: string[] }>("/questions/topics");
      return response.data.topics;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error: ", error.response?.data || error.message);
        throw new Error(
          error.response?.data?.message || "An error occurred while fetching topics"
        );
      } else {
        console.error("Unknown error: ", error);
        throw new Error("An unexpected error occurred");
      }
    }
  };

  // Fetch topics on component mount
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const topicsData = await fetchTopics();
        setTopics(topicsData);
      } catch (error) {
        console.error(error);
      }
    };

    loadTopics();
  }, []);

  return (
    <Flex direction="column" p={10} w="full" h="200vh">
      {/* Header Section */}
      <Flex justify="space-between" align="center" mb={10}>
        <HStack spacing={8}>
          <Avatar size="2xl" src="" />
          <Text fontSize="6xl" fontWeight="bold">
            Welcome back, {user.username}!
          </Text>
        </HStack>
        <Flex className="bg-white bg-opacity-10" align="center" justify="space-between" px={20} py={10} borderRadius="xl">
          <Flex direction="column" mr={10}>
            <Text fontSize="5xl" fontWeight="bold" textAlign="center">
              12/20
            </Text>
            <Text fontSize="3xl" fontWeight="bold" textAlign="center">
              questions
            </Text>
          </Flex>
          <Button
            mt={6} // Margin top to create space between text and button
            borderColor="purple.300" // Purple border
            borderWidth={2}
            borderRadius="full" // Makes the button oval
            size="lg"
            variant="outline" // Outline variant to remove background
            color="purple.300" // Text color
            _hover={{ bgColor: "purple.50" }} // Light background on hover
            onClick={() => navigate("/questions")}
          >
            View
          </Button>
        </Flex>
      </Flex>
      {/* Topic and Difficulty Section */}
      <Flex justify="space-between">
        <Box w="30%">
          <Text fontSize="2xl" mb={4}>Select Topic: </Text>
          <Dropdown topics={topics} onSelect={(topic) => setSelectedTopic(topic)} />
        </Box>
        <Box w="30%">
          <Text fontSize="2xl" mb={4}>Select Difficulty:</Text>
          <VStack spacing={6}>
              {COMPLEXITIES.map((value, ind) => (
              <Button
                key={ind}
                w="100%"
                h="14"
                bgColor={selectedDifficulty === value.id ? "purple.600" : "purple.500"} // Change background color if selected
                color="white"
                fontSize="lg"
                border="2px"
                borderColor={selectedDifficulty === value.id ? "white" : "transparent"} // Conditional border color
                _hover={{ bgColor: selectedDifficulty === value.id ? "purple.700" : "purple.600" }} // Adjust hover effect
                onClick={() => {
                  setSelectedDifficulty(value.id);
                }}
              >
                {value.id}
              </Button>
            ))}
          </VStack>
        </Box>
        <VStack w="30%" spacing={6} align="center">
          {services.map((value, ind) => (
            <Button
              key={ind}
              w="100%"
              h="14" // Increased height
              bgColor="purple.500"
              color="white"
              fontSize="lg" // Increased font size
              _hover={{ bgColor: "purple.600" }}
              rightIcon={<FaArrowRight />}
              isDisabled={value === "Let's Match" && (selectedDifficulty === "" || selectedTopic === "")}
              onClick={() => {
                if (value === "Let's Match") {
                  navigate(
                    `/matching?topic=${selectedTopic}&difficulty=${selectedDifficulty}`
                  );
                }
              }}
            >
              {value}
            </Button>
          ))}
          {(selectedDifficulty === "" || selectedTopic === "") && (
            <Text fontWeight="bold" color="red.300" fontSize="lg">
              Select a topic and difficulty before matching
            </Text>
          )}
        </VStack>
      </Flex>
    </Flex>
  );
};

export default DashboardView;