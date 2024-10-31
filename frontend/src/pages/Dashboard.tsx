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
import { format } from "date-fns";  // Added date-fns for formatting dates

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
  const currentEntries = filteredAttempts.slice(indexOfFirstEntry, indexOfLastEntry);

  useEffect(() => {
    const fetchAttemptsData = async () => {
      if (!token) {
        console.error("No token available");
        return;
      }

      try {
        const data = await fetchUserAttempts(token);
        setAttempts(data);

        // Calculate counts
        const newCounts: Counts = { Easy: 0, Medium: 0, Hard: 0 };
        data.forEach((attempt: Attempt) => {
          const difficulty = attempt.questionId.complexity;
          if (newCounts[difficulty] !== undefined) {
            newCounts[difficulty]++;
          }
        });
        setCounts(newCounts);

        // Apply initial filter and sort
        filterAndSortAttempts(data, searchQuery, sortBy);
      } catch (error: any) {
        console.error("Failed to fetch attempts", error.response?.data || error.message);
      }
    };

    fetchAttemptsData();
  }, [token]);

  const filterAndSortAttempts = (data: Attempt[], query: string, criteria: string) => {
    const filtered = data.filter((attempt) => {
      const searchTerm = query.toLowerCase();
      const titleMatch = attempt.questionId.title.toLowerCase().includes(searchTerm);
      const categoryMatch = attempt.questionId.category.some((category) =>
        category.toLowerCase().includes(searchTerm)
      );
      const complexityMatch = attempt.questionId.complexity.toLowerCase().includes(searchTerm);
      const peerMatch = attempt.peerUserName
        ? attempt.peerUserName.toLowerCase().includes(searchTerm)
        : false;
      return titleMatch || categoryMatch || complexityMatch || peerMatch;
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime());

    if (criteria === "Difficulty") {
      const difficultyOrder: DifficultyLevel[] = ["Easy", "Medium", "Hard"];
      sorted.sort((a, b) => difficultyOrder.indexOf(a.questionId.complexity) - difficultyOrder.indexOf(b.questionId.complexity));
    } else if (criteria === "Topic") {
      sorted.sort((a, b) => (a.questionId.category[0] || "").localeCompare(b.questionId.category[0] || ""));
    }

    setFilteredAttempts(sorted);
  };

  useEffect(() => {
    filterAndSortAttempts(attempts, searchQuery, sortBy);
  }, [searchQuery, sortBy, attempts]);

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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

  
  return (
    <>
      <Header />

      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Box display="flex" flexDirection="row" gap={2}>
          <Box p={2} border={1} borderColor="grey.300" borderRadius={2} flex="1 1 25%">
            <Typography variant="h5" gutterBottom>{user ? user.name : "Loading..."}</Typography>
            <Typography variant="subtitle1" gutterBottom>Proficiency: Expert</Typography>

            <Box mt={3} mb={3}>
              <Typography variant="subtitle1" gutterBottom>Questions Solved:</Typography>
              <Box>
                <Typography>Easy: {counts.Easy}</Typography>
                <Typography>Medium: {counts.Medium}</Typography>
                <Typography>Hard: {counts.Hard}</Typography>
              </Box>
            </Box>

            <Box mt={3}>
              <Button variant="outlined" fullWidth onClick={() => navigate("/dashboard/edit-profile")}>Edit Profile</Button>
              <Button variant="outlined" fullWidth onClick={() => navigate("/dashboard/change-password")}>Change Password</Button>
            </Box>
          </Box>

          <Box p={2} border={1} borderColor="grey.300" borderRadius={2} flex="1 1 100%">
            <Typography variant="h6" gutterBottom>Attempts History</Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <TextField variant="outlined" label="Search" size="small" value={searchQuery} onChange={handleSearchChange} />
              <TextField select label="Sort By" value={sortBy} onChange={handleSortChange} size="small">
                <MenuItem value="Newest">Newest</MenuItem>
                <MenuItem value="Difficulty">Difficulty</MenuItem>
                <MenuItem value="Topic">Topic</MenuItem>
              </TextField>
            </Box>

            <Paper elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Topic</TableCell>
                    <TableCell>Peer</TableCell>
                    <TableCell>Difficulty</TableCell>
                    <TableCell>Completed At (SGT)</TableCell>
                    <TableCell>Time Taken</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentEntries.map((attempt, index) => (
                    <TableRow key={index}>
                      <TableCell>{highlightText(attempt.questionId.title, searchQuery)}</TableCell>
                      <TableCell>{highlightText(attempt.questionId.category.join(", "), searchQuery)}</TableCell>
                      <TableCell>{highlightText(attempt.peerUserName || "N/A", searchQuery)}</TableCell>
                      <TableCell>{highlightText(attempt.questionId.complexity, searchQuery)}</TableCell>
                      <TableCell>{attempt.timestamp ? format(new Date(attempt.timestamp), "MMM dd, yyyy") : "N/A"}</TableCell>                      
                      <TableCell>{attempt.timeTaken ? attempt.timeTaken >= 3600 ? `${Math.floor(attempt.timeTaken / 3600)}h ${Math.floor((attempt.timeTaken % 3600) / 60)}m ${attempt.timeTaken % 60}s`
                                  : `${Math.floor(attempt.timeTaken / 60)}m ${attempt.timeTaken % 60}s`
                                  : "N/A"}</TableCell>                      
                      <TableCell>
                        <Button variant="contained" color="primary" onClick={() => navigate(`/matching`)}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Typography variant="body2">Showing data {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries} entries</Typography>
              <Box>
                {pageNumbers.map((pageNumber) => (
                  <IconButton key={pageNumber} onClick={() => handlePageChange(pageNumber)} color={pageNumber === currentPage ? "primary" : "default"}>{pageNumber}</IconButton>
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