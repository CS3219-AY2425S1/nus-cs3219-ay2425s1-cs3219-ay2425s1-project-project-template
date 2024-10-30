import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Text,
  Textarea,
  Select,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { Question } from "../types";
import useQuestionTopics from "../hooks/useQuestionTopics";
import useQuestionDifficulties from "../hooks/useQuestionDifficulties";

interface EditQuestionProps {
  question: Question;
  onSave: (updatedQuestion: Question) => void;
  onCancel: () => void;
}

const EditQuestion: React.FC<EditQuestionProps> = ({
  question,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description);
  const [category, setCategory] = useState(question.category);
  const [difficulty, setDifficulty] = useState(question.difficulty);
  const { topics, error: topicsError } = useQuestionTopics();
  const { difficulties, error: difficultiesError } = useQuestionDifficulties();
  const toast = useToast();

  useEffect(() => {
    setTitle(question.title);
    setDescription(question.description);
    setCategory(question.category);
    setDifficulty(question.difficulty);
  }, [question]);

  const handleSave = () => {
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

    onSave({
      ...question,
      title,
      description,
      category,
      difficulty,
    });
  };

  return (
    <Box maxWidth="600px" margin="0 auto" padding="4" boxShadow="md">
      {/* Edit title */}
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        mb={4}
      />

      {/* Edit description */}
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        mb={4}
        minHeight="150px"
      />

      {/* Edit Topics */}
      {topicsError ? (
        <Text color="red.500" mb={4}>
          {topicsError}
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

      {/* Edit difficulty */}
      {difficultiesError ? (
        <Text color="red.500" mb={4}>
          {difficultiesError}
        </Text>
      ) : difficulties.length === 0 ? (
        <Spinner size="md" />
      ) : (
        <Select
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

      <Button colorScheme="blue" onClick={handleSave} mr={3}>
        Save Changes
      </Button>
      <Button onClick={onCancel}>Cancel</Button>
    </Box>
  );
};

export default EditQuestion;
