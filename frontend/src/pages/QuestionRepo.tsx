import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from "@mui/material";
import Header from "../components/Header";
import { getAllQuestions } from "../api/questionApi";
import { Question } from "../@types/question";

const QuestionRepo = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getAllQuestions();
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      }
    };

    fetchQuestions();
  }, []);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = questions.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalEntries = questions.length;
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalEntries / entriesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Box
          p={2}
          border={1}
          borderColor="grey.300"
          borderRadius={2}
          flex="1 1 75%"
        >
          <Typography variant="h6" gutterBottom>
            Question Repository
          </Typography>

          <Paper elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Question Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Difficulty</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentEntries.map((question) => (
                  <TableRow key={question._id}>
                    <TableCell>{question.title}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{question.complexity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Typography variant="body2">
              Showing {indexOfFirstEntry + 1} to{" "}
              {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries}{" "}
              entries
            </Typography>
            <Box>
              {pageNumbers.map((pageNumber) => (
                <IconButton
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  color={pageNumber === currentPage ? "primary" : "default"}
                >
                  {pageNumber}
                </IconButton>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default QuestionRepo;
