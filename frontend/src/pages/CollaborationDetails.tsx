import React from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CollaborationDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { attempt } = location.state || {}; // Access the attempt object from state

  // If no attempt data is found, return a loading message
  if (!attempt) {
    return <div>Loading...</div>;
  }

  const {
    questionId: { title, description, category, complexity },
    peerUserName,
    timestamp,
    timeTaken,
    codeContent,
    language,
  } = attempt;

  // Format the timestamp and time taken
  const formattedTimestamp = timestamp ? format(new Date(timestamp), "dd MMMM yyyy, hh:mm a") : "N/A";
  const formattedTimeTaken =
    timeTaken >= 3600
      ? `${Math.floor(timeTaken / 3600)}h ${Math.floor((timeTaken % 3600) / 60)}m ${timeTaken % 60}s`
      : timeTaken >= 60
      ? `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`
      : `${timeTaken}s`;

  // Styling for difficulty chip
  const difficultyColor = complexity === "Easy" ? "success" : complexity === "Medium" ? "warning" : "error";
  
  const formatLanguageName = (language: string | undefined) => {
    switch (language) {
      case "cpp":
        return "C++";
      case "java":
        return "Java";
      case "python":
        return "Python3";
      case "c":
        return "C";
      case "javascript":
        return "JavaScript";
      default:
        return "JavaScript";
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        color: "white",
        backgroundColor: "#1c1c1c",
        borderRadius: 4,
        maxWidth: 1200,
        margin: "0 auto",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", mb: 2 }}>
        Collaboration with {peerUserName || "Unknown"}
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" sx={{ color: "#bbb" }}>
        Completed on {formattedTimestamp} in {formattedTimeTaken}
      </Typography>

      {/* Main Content Area */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, mt: 4 }}>
        {/* Left Side: Question Details */}
        <Box sx={{ flex: 1, backgroundColor: "#2a2a2a", p: 3, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#fff" }}>
            {title || "Question Title"}
          </Typography>

          {/* Tags for Difficulty and Category */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Chip label={complexity} color={difficultyColor} size="small" sx={{ fontWeight: "bold", color: "#fff" }} />
            {category.map((topic: string, index: number) => (
              <Chip key={index} label={topic} variant="outlined" size="small" sx={{ color: "#bbb", borderColor: "#444" }} />
            ))}
          </Box>

          <Typography variant="body1" sx={{ color: "#ddd", whiteSpace: "pre-wrap" }}>
            {description || "No description available."}
          </Typography>
        </Box>

        {/* Right Side: Code and Test Cases */}
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              p: 3,
              backgroundColor: "#2e2e2e",
              borderRadius: 3,
              overflowX: "auto",
              color: "#f5f5f5",
              fontFamily: "monospace",
              fontSize: "0.95rem",
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ color: "#ddd", mb: 2 }}>
              Code Written in {formatLanguageName(language)}
            </Typography>
            <SyntaxHighlighter language={language || "javascript"} style={materialDark}>
              {codeContent || "// No code content available"}
            </SyntaxHighlighter>
          </Box>

          {/* Placeholder for Test Cases Section */}
          <Box
            sx={{
              mt: 3,
              p: 3,
              backgroundColor: "#1e1e1e",
              borderRadius: 3,
              color: "#fff",
              fontSize: "0.9rem",
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Test Cases (Coming Soon)
            </Typography>
            <Typography variant="body2" sx={{ color: "#bbb" }}>
              This section will display all the test cases that have been run by the user.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Back Button */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            "&:hover": {
              backgroundColor: "#0056b3",
            },
          }}
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default CollaborationDetails;