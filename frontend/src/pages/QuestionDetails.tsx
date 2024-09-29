import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchQuestionById } from "../api/questionApi";
import { useEffect, useState } from "react";
import { Question } from "../@types/question";
import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
  Divider,
  Button,
} from "@mui/material";

const QuestionDetails = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuestionById(id)
        .then((data) => {
          if (data) {
            setQuestion(data);
            setError(null);
          } else {
            setError("Question not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching question details:", error);
          setError("Error fetching question details");
        });
    } else {
      setError("Invalid question ID");
    }
  }, [id]);

  const getChipColor = (complexity: string) => {
    switch (complexity) {
      case "Easy":
        return "success";
      case "Medium":
        return "warning";
      case "Hard":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <>
      <Header></Header>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back To Question Repository
        </Button>
        <Box
          p={3}
          border={1}
          borderColor="grey.300"
          borderRadius={2}
          boxShadow={1}
          bgcolor="background.paper"
        >
          {error ? (
            <Typography variant="h6" color="error">
              Error: {error}
            </Typography>
          ) : (
            question && (
              <>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h5">{question.title}</Typography>
                  <Chip
                    label={question.complexity}
                    color={getChipColor(question.complexity)}
                    variant="outlined"
                  />
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" paragraph>
                  {question.description.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </Typography>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Stack direction="row" spacing={1}>
                  {question.category?.map((topic) => (
                    <Chip key={topic} label={topic} variant="outlined" />
                  ))}
                </Stack>
              </>
            )
          )}
        </Box>
      </Container>
    </>
  );
};

export default QuestionDetails;
