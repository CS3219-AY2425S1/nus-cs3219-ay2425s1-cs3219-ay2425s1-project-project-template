import React, { useState } from "react";
import { Link } from "react-router-dom";
import useQuestions from "../hooks/useQuestions";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Box,
  Text,
  Spinner,
  InputLeftAddon,
  InputGroup,
  Card,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import AddQuestion from "./AddQuestion";
import { Question } from "../types";

interface QuestionListProps {
  userIsAdmin: boolean;
}

const QuestionList: React.FC<QuestionListProps> = ({ userIsAdmin }) => {
  const { questions, loading, error } = useQuestions();
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "asc" | "desc" | "both";
  }>({ key: "questionId", direction: "both" });
  const [currentPage, setCurrentPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const rowsPerPage = 7;

  type SortableKeys = keyof Question;

  // Filtered and Sorted Questions
  const filteredQuestions = questions
    .filter((question) =>
      question.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortConfig.key) {
        if (sortConfig.direction === "asc") {
          return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        } else if (sortConfig.direction === "desc") {
          return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
        }
      }
      return 0; // No sorting
    });

  // Pagination Logic
  const indexOfLastQuestion = currentPage * rowsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - rowsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const totalPages = Math.ceil(filteredQuestions.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSort = (key: string) => {
    let direction = "asc"; // Default to ascending
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc"; // Change to descending
      } else if (sortConfig.direction === "desc") {
        direction = "both"; // Reset to both (no sorting)
      }
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <Box textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return <Text color="red.500">Error: {error}</Text>;
  }

  return (
    <Box display="flex" justifyContent="flex-end">
      <Card p={6} borderRadius="lg" maxW="1000px">
        <Box display="flex" justifyContent="space-between" mb={4}>
          {/* Search bar */}
          <InputGroup mr={4}>
            <InputLeftAddon fontWeight="bold">Search:</InputLeftAddon>
            <Input
              placeholder="your questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="md"
              focusBorderColor="blue.500"
            />
          </InputGroup>

          {/* Add Question Button */}
          {userIsAdmin && (
            <IconButton
              aria-label="Add Question"
              icon={<AddIcon />}
              colorScheme="blue"
              onClick={onOpen}
            />
          )}
        </Box>

        {/* Table */}
        <TableContainer borderRadius={20}>
          <Table
            variant="striped"
            size="lg"
            border="1px"
            borderColor="gray.200"
            sx={{ fontFamily: "Poppins, sans-serif" }}
          >
            <Thead>
              <Tr>
                {/* ID Column */}
                <Th
                  cursor="pointer"
                  bgColor="yellow.300"
                  onClick={() => handleSort("questionId")}
                  fontFamily="Poppins, sans-serif"
                >
                  ID{" "}
                  {sortConfig.key === "questionId"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : sortConfig.direction === "desc"
                      ? "↓"
                      : "↑↓"
                    : "↑↓"}
                </Th>

                {/* Title Column */}
                <Th
                  cursor="pointer"
                  bgColor="yellow.300"
                  onClick={() => handleSort("title")}
                  fontFamily="Poppins, sans-serif"
                >
                  Title{" "}
                  {sortConfig.key === "title"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : sortConfig.direction === "desc"
                      ? "↓"
                      : "↑↓"
                    : "↑↓"}
                </Th>

                {/* Difficulty Column */}
                <Th
                  cursor="pointer"
                  bgColor="yellow.300"
                  onClick={() => handleSort("difficulty")}
                  fontFamily="Poppins, sans-serif"
                >
                  Difficulty{" "}
                  {sortConfig.key === "difficulty"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : sortConfig.direction === "desc"
                      ? "↓"
                      : "↑↓"
                    : "↑↓"}
                </Th>

                {/* Topic Column */}
                <Th bgColor="yellow.300" fontFamily="Poppins, sans-serif">
                  Topic
                </Th>
              </Tr>
            </Thead>

            <Tbody>
              {currentQuestions.map((question) => (
                <Tr key={question.questionId}>
                  <Td>{question.questionId}</Td>

                  <Td>
                    <Link to={`/questions/${question.questionId}`}>
                      {question.title}
                    </Link>
                  </Td>

                  <Td>
                    <Box
                      display="inline-block"
                      px={2}
                      py={1}
                      borderRadius="md"
                      bgColor={
                        question.difficulty.toLowerCase() === "easy"
                          ? "green.500"
                          : question.difficulty.toLowerCase() === "medium"
                          ? "yellow.400"
                          : "red.500"
                      }
                      color="white"
                      fontWeight="bold"
                      textAlign="center"
                    >
                      {question.difficulty}
                    </Box>
                  </Td>

                  <Td>{question.category.join(", ")}</Td>
                  {/* <Td>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDelete(question.questionId)}
                    >
                      Delete
                    </Button>
                    <Link to={`/questions/edit/${question.questionId}`}>
                      <Button colorScheme="teal" ml={2}>
                        Edit
                      </Button>
                    </Link>
                  </Td> */}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Flex justify="space-between" mt={4} align="center">
          {/* Page Info on the Left */}
          <Text>
            Page {currentPage} of {totalPages}
          </Text>

          <Box>
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              mr={2}
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </Box>
        </Flex>
      </Card>

      {/* Modal for Adding Question */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a New Question</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddQuestion />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default QuestionList;
