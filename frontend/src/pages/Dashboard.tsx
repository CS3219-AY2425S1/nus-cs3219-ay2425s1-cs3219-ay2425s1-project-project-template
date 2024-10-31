import {
  Button,
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from "@mui/material";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { fetchUserAttempts } from "../api/attemptApi";
import { DifficultyLevel, Attempt, Counts } from "../@types/attempt";


const Dashboard = () => {
  // State variables
  const [sortBy, setSortBy] = useState<string>("Newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [filteredAttempts, setFilteredAttempts] = useState<Attempt[]>([]);
  const [counts, setCounts] = useState<Counts>({ Easy: 0, Medium: 0, Hard: 0 });

  // Auth and navigation
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Pagination
  const entriesPerPage = 8;
  const totalEntries = filteredAttempts.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredAttempts.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  // Fetch attempts when component mounts or token changes
  useEffect(() => {
    const fetchAttemptsData = async () => {
      if (!token) {
        console.error("No token available");
        return;
      }

      console.log("Fetching user attempts with token:", token);
      try {
        const data = await fetchUserAttempts(token);
        console.log("Fetched attempts data:", data);
        setAttempts(data);
        setFilteredAttempts(data);

        // Calculate counts
        const newCounts: Counts = { Easy: 0, Medium: 0, Hard: 0 };
        data.forEach((attempt: Attempt) => {
          const difficulty = attempt.questionId.complexity;
          if (newCounts[difficulty] !== undefined) {
            newCounts[difficulty]++;
          } else {
            console.warn(`Unexpected difficulty level: ${difficulty}`);
          }
        });
        setCounts(newCounts);
        console.log("Updated counts:", newCounts);
      } catch (error: any) {
        console.error("Failed to fetch attempts", error.response?.data || error.message);
      }
    };

    fetchAttemptsData();
  }, [token]);

  // Sort attempts whenever sortBy or attempts change
  useEffect(() => {
    const sortAttempts = () => {
      console.log(`Sorting attempts by: ${sortBy}`);
      const sorted = [...attempts];
      if (sortBy === "Difficulty") {
        const difficultyOrder: DifficultyLevel[] = ["Easy", "Medium", "Hard"];
        sorted.sort((a, b) => {
          return (
            difficultyOrder.indexOf(a.questionId.complexity) -
            difficultyOrder.indexOf(b.questionId.complexity)
          );
        });
      } else if (sortBy === "Topic") {
        sorted.sort((a, b) => {
          const categoryA = a.questionId.category[0] || "";
          const categoryB = b.questionId.category[0] || "";
          return categoryA.localeCompare(categoryB);
        });
      } else if (sortBy === "Newest") {
        // Assuming attempts have a timestamp, sort by newest
        // If not, this needs to be adjusted accordingly
        // Here, as no timestamp is present, keeping the order
      }
      setFilteredAttempts(sorted);
      console.log("Sorted attempts:", sorted);
    };

    sortAttempts();
  }, [sortBy, attempts]);

  // Filter attempts whenever searchQuery or attempts change
  useEffect(() => {
    const filterAttempts = () => {
      console.log(`Filtering attempts with search query: ${searchQuery}`);
      const filtered = attempts.filter((attempt) => {
        const query = searchQuery.toLowerCase();
        const titleMatch = attempt.questionId.title.toLowerCase().includes(query);
        const categoryMatch = attempt.questionId.category.some((category) =>
          category.toLowerCase().includes(query)
        );
        const complexityMatch = attempt.questionId.complexity.toLowerCase().includes(query);
        const peerMatch = attempt.peerUserName
          ? attempt.peerUserName.toLowerCase().includes(query)
          : false;
        return titleMatch || categoryMatch || complexityMatch || peerMatch;
      });
      setFilteredAttempts(filtered);
      setCurrentPage(1);
      console.log("Filtered attempts:", filtered);
    };

    filterAttempts();
  }, [searchQuery, attempts]);

  // Handlers
  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(event.target.value);
    console.log(`Sort by changed to: ${event.target.value}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    console.log(`Search query changed to: ${event.target.value}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    console.log(`Page changed to: ${pageNumber}`);
  };

  // Function to highlight search terms in text
  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery) return text;

    // Escape special regex characters in the search query
    const escapeRegExp = (string: string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    // Create a regular expression for the search term
    const escapedSearchTerm = escapeRegExp(searchQuery);
    const regex = new RegExp(`(${escapedSearchTerm})`, "gi");

    // Split the text by the search term
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <strong key={index}>{part}</strong> // Bold the matching part
          ) : (
            <span key={index}>{part}</span> // Regular text for non-matching parts
          )
        )}
      </>
    );
  };

  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Header />

      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Box display="flex" flexDirection="row" gap={2}>
          {/* User Info Section */}
          <Box
            p={2}
            border={1}
            borderColor="grey.300"
            borderRadius={2}
            flex="1 1 25%"
          >
            <Typography variant="h5" gutterBottom>
              {user ? user.name : "Loading..."}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Proficiency: Expert
            </Typography>

            <Box mt={3} mb={3}>
              <Typography variant="subtitle1" gutterBottom>
                Questions Solved:
              </Typography>
              <Box>
                <Typography>Easy: {counts.Easy}</Typography>
                <Typography>Medium: {counts.Medium}</Typography>
                <Typography>Hard: {counts.Hard}</Typography>
              </Box>
            </Box>

            <Box mt={3}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/dashboard/edit-profile")}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/dashboard/change-password")}
              >
                Change Password
              </Button>
            </Box>
          </Box>

          {/* Attempts History Section */}
          <Box
            p={2}
            border={1}
            borderColor="grey.300"
            borderRadius={2}
            flex="1 1 75%"
          >
            <Typography variant="h6" gutterBottom>
              Attempts History
            </Typography>

            {/* Search and Sort Controls */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <TextField
                variant="outlined"
                label="Search"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <TextField
                select
                label="Sort By"
                value={sortBy}
                onChange={handleSortChange}
                size="small"
              >
                <MenuItem value="Newest">Newest</MenuItem>
                <MenuItem value="Difficulty">Difficulty</MenuItem>
                <MenuItem value="Topic">Topic</MenuItem>
              </TextField>
            </Box>

            {/* Attempts Table */}
            <Paper elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Topic</TableCell>
                    <TableCell>Peer</TableCell>
                    <TableCell>Difficulty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentEntries.map((attempt, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {highlightText(attempt.questionId.title, searchQuery)}
                      </TableCell>
                      <TableCell>
                        {highlightText(
                          attempt.questionId.category.join(", "),
                          searchQuery
                        )}
                      </TableCell>
                      <TableCell>
                        {highlightText(attempt.peerUserName || "N/A", searchQuery)}
                      </TableCell>
                      <TableCell>
                        {highlightText(
                          attempt.questionId.complexity,
                          searchQuery
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            {/* Pagination Controls */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body2">
                Showing data {indexOfFirstEntry + 1} to{" "}
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
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
