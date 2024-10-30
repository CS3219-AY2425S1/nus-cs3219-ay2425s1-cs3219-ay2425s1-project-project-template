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
import { Question } from "../types";
import useQuestionTopics from "../hooks/useQuestionTopics";
import useQuestionDifficulties from "../hooks/useQuestionDifficulties";

interface AddQuestionProps {
  onAddQuestion: (question: Omit<Question, "questionId">) => void;
}

const AddQuestion: React.FC<AddQuestionProps> = ({ onAddQuestion }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("");
  const { topics, error } = useQuestionTopics();
  const { difficulties, error: difficultiesError } = useQuestionDifficulties();
  const toast = useToast();

  const handleAddQuestion = () => {
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

    onAddQuestion({
      title,
      description,
      category,
      difficulty,
    });

    setTitle("");
    setDescription("");
    setCategory([]);
    setDifficulty("");
  };

  return (
    <Box margin="0 auto" padding="4" boxShadow="md">
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
        minHeight="150px"
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
