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
} from "@chakra-ui/react";

const QuestionList: React.FC = () => {
  const { questions, loading, error } = useQuestions();
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

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
      {/* This is the card that wraps the search bar and table */}
      <Card
        p={6}
        // bgColor="gray.100"
        borderRadius="lg"
        // w="100%"
        maxW="1000px"
        position="absolute"
        right="24px" // Aligning with My Account Button on the right
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
          >
            <Thead>
              <Tr>
                <Th
                  cursor="pointer"
                  bgColor="yellow.300"
                  onClick={() => handleSort("id")}
                >
                  ID{" "}
                  {sortConfig.key === "id" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </Th>
                <Th
                  cursor="pointer"
                  bgColor="yellow.300"
                  onClick={() => handleSort("difficulty")}
                >
                  Difficulty{" "}
                  {sortConfig.key === "difficulty" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </Th>
                <Th bgColor="yellow.300">Topic</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredQuestions.map((question) => (
                <Tr key={question.id}>
                  <Td>
                    <Link to={`/questions/${question.id}`}>{question.id}</Link>
                  </Td>
                  <Td>
                    <Text
                      as="span"
                      fontWeight="bold"
                      color={
                        question.difficulty.toLowerCase() === "easy"
                          ? "green.500"
                          : question.difficulty.toLowerCase() === "medium"
                          ? "yellow.500"
                          : "red.500"
                      }
                    >
                      {question.difficulty}
                    </Text>
                  </Td>
                  <Td>{question.title}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default QuestionList;
