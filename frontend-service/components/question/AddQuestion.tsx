import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  Textarea,
  Select,
  useToast,
  Spinner,
  Text,
} from "@chakra-ui/react";
import useQuestionTopics from "../hooks/useQuestionTopics";
import useQuestionDifficulties from "../hooks/useQuestionDifficulties";

interface AddQuestionProps {
  onAddQuestion: () => void;
}

const AddQuestion: React.FC<AddQuestionProps> = ({ onAddQuestion }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("");
  const { topics, error } = useQuestionTopics();
  const { difficulties, difficultiesError } = useQuestionDifficulties();
  const toast = useToast();

  const handleAddQuestion = async () => {
    if (!title || !description || !category.length || !difficulty) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: Math.floor(Math.random() * 10000),
          title,
          description,
          category,
          difficulty,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Question added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTitle("");
        setDescription("");
        setCategory([]);
        setDifficulty("");

        onAddQuestion(); // refresh table
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to add question",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding the question.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="600px" margin="0 auto" padding="4" boxShadow="md">
      {/* Enter title */}
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        mb={4}
      />

      {/* Enter description */}
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        mb={4}
      />

      {/* Select Topics */}
      {error ? (
        <Text color="red.500" mb={4}>
          {error}
        </Text>
      ) : topics.length === 0 ? (
        <Spinner size="md" />
      ) : (
        <Select
          placeholder="Select a topic"
          value={category.join(", ")}
          onChange={(e) =>
            setCategory(e.target.value.split(",").map((c: string) => c.trim()))
          }
          mb={4}
        >
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </Select>
      )}

      {/* Select Difficulty from Fetched Data */}
      {difficultiesError ? (
        <Text color="red.500" mb={4}>
          {difficultiesError}
        </Text>
      ) : difficulties.length === 0 ? (
        <Spinner size="md" />
      ) : (
        <Select
          placeholder="Select Difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          mb={4}
        >
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </Select>
      )}

      <Button colorScheme="blue" onClick={handleAddQuestion}>
        Add Question
      </Button>
    </Box>
  );
};

export default AddQuestion;
