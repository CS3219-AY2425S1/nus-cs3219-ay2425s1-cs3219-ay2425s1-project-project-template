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
  MenuItem,
  TextField,
} from "@mui/material";
import Header from "../components/Header";
import { getAllQuestions } from "../api/questionApi"; // Ensure your API supports pagination & sorting params
import { Question } from "../@types/question";
import { useNavigate } from "react-router-dom";

const QuestionRepo = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const entriesPerPage = 10;

  const [sortField, setSortField] = useState<string>("title"); // Default sort field
  const [sortOrder, setSortOrder] = useState<string>("asc"); // Default sort order

  const navigate = useNavigate();

  const handleRowClick = (id: string) => {
    navigate(`/questions/${id}`);
  };

  const fetchQuestions = async (page: number, sort: string, order: string) => {
    try {
      // Fetch questions with pagination and sorting
      const data = await getAllQuestions({
        page,
        limit: entriesPerPage,
        sort,
        order,
      });
      setQuestions(data.questions);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalQuestions(data.totalQuestions);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  };

  useEffect(() => {
    // Fetch questions when the component mounts or sorting changes
    fetchQuestions(currentPage, sortField, sortOrder);
  }, [currentPage, sortField, sortOrder]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSortField(event.target.value as string);
  };

  const handleOrderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSortOrder(event.target.value as string);
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

          {/* Sorting Controls */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <TextField
              select
              label="Sort By"
              value={sortField}
              onChange={handleSortChange}
              size="small"
              variant="outlined"
              // sx={{ width: 150 }}
            >
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="complexity">Complexity</MenuItem>
              <MenuItem value="category">Category</MenuItem>
            </TextField>

            <TextField
              select
              label="Order"
              value={sortOrder}
              onChange={handleOrderChange}
              size="small"
              variant="outlined"
              // sx={{ width: 150 }}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </TextField>
          </Box>
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
                {questions.map((question) => (
                  <TableRow
                    key={question._id}
                    hover
                    onClick={() => handleRowClick(question._id)}
                    style={{ cursor: "pointer" }}
                  >
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
              Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
              {Math.min(currentPage * entriesPerPage, totalQuestions)} of{" "}
              {totalQuestions} entries
            </Typography>

            <Box>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <IconButton
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    color={pageNumber === currentPage ? "primary" : "default"}
                  >
                    {pageNumber}
                  </IconButton>
                )
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default QuestionRepo;
