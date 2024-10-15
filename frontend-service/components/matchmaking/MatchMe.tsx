import React, { useState } from "react";
import { Button, Select, Box, Heading, Flex, useToast } from "@chakra-ui/react";

interface MatchMeProps {
  onMatchMe: () => void;
}

const MatchMe: React.FC<MatchMeProps> = ({ onMatchMe }) => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const toast = useToast();

  const handleMatchMeClick = () => {
    if (topic && difficulty) {
      onMatchMe();
    } else {
      toast({
        title: "Selection required.",
        description: "Please select both a topic and a difficulty level.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box textAlign="center" mt={10}>
      <Flex align="center" flexDirection="column">
        <Heading as="h1" mb={6}>
          Find a Match
        </Heading>

        <Box mb={6}>
          <Select
            placeholder="Select a topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            mb={4}
            w="300px"
          >
            {/* TODO: get topics from db */}
            <option value="data-structures">Data Structures</option>
            <option value="algorithms">Algorithms</option>
            <option value="databases">Databases</option>
          </Select>

          <Select
            minW=""
            placeholder="Select difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            w="300px"
          >
            {/* TODO: get difficulties from db */}
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </Box>

        <Button colorScheme="blue" onClick={handleMatchMeClick}>
          Match Me
        </Button>
      </Flex>
    </Box>
  );
};

export default MatchMe;
