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
} from "@chakra-ui/react";

const QuestionList: React.FC = () => {
  const { questions, loading, error } = useQuestions();
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  // Filtered and Sorted Questions
  const filteredQuestions = questions
    .filter((question) =>
      question.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortConfig.key) {
        return sortConfig.direction === "asc"
          ? a[sortConfig.key] > b[sortConfig.key]
            ? 1
            : -1
          : a[sortConfig.key] < b[sortConfig.key]
          ? 1
          : -1;
      }
      return 0;
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

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
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
      <Card
        p={6}
        borderRadius="lg"
        maxW="1000px"
        position="absolute"
        right="24px"
        sx={{
          left: "calc(50% - 325px)",
        }}
      >
        {/* Search bar */}
        <Box mb={6}>
          <InputGroup>
            <InputLeftAddon fontWeight="bold">Search:</InputLeftAddon>
            <Input
              placeholder="your questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="md"
              focusBorderColor="blue.500"
            />
          </InputGroup>
        </Box>

        {/* Table */}
        <TableContainer borderRadius={20}>
          <Table
            variant="striped"
            size="lg"
            border="1px"
            borderColor="gray.200"
            sx={{ fontFamily: "Poppins, sans-serif" }} // Setting Poppins font for the entire table
          >
            <Thead>
              <Tr>
                <Th
                  cursor="pointer"
                  bgColor="yellow.300"
                  onClick={() => handleSort("id")}
                  fontFamily="Poppins, sans-serif" // Applying Poppins font to headers
                >
                  ID{" "}
                  {sortConfig.key === "id" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}{" "}
                  <span>↑↓</span>
                </Th>
                <Th
                  cursor="pointer"
                  bgColor="yellow.300"
                  onClick={() => handleSort("difficulty")}
                  fontFamily="Poppins, sans-serif" // Applying Poppins font to headers
                >
                  Difficulty{" "}
                  {sortConfig.key === "difficulty" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}{" "}
                  <span>↑↓</span>
                </Th>
                <Th bgColor="yellow.300" fontFamily="Poppins, sans-serif">
                  Topic
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentQuestions.map((question) => (
                <Tr key={question.id}>
                  <Td>
                    <Link to={`/questions/${question.id}`}>{question.id}</Link>
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
                  <Td>{question.title}</Td>
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

          {/* Next/Previous Buttons on the Right */}
          <Box>
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              colorScheme="blue"
              mr={2} // Adds margin between the buttons
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              colorScheme="blue"
            >
              Next
            </Button>
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};

export default QuestionList;
