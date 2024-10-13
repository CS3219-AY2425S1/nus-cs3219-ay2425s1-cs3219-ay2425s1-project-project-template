import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, CircularProgress } from '@mui/material';
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import { fetchAllTopics } from '../api/questionApi';
import { findMatch } from '../api/matchingApi';

const MatchSelection: React.FC = () => {
  const [difficulty, setDifficulty] = useState<string>('Easy');
  const [topic, setTopic] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);
  const [noMatchFound, setNoMatchFound] = useState<boolean>(false);
  const { user, token } = useAuth();

  useEffect(() => {
    const getTopics = async () => {
      try {
        const fetchedTopics = await fetchAllTopics();
        setTopics(fetchedTopics);
        if (fetchedTopics.length > 0) {
          setTopic(fetchedTopics[0]);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    getTopics();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isMatching && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval!);
      setIsMatching(false);
      setNoMatchFound(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMatching, timer]);

  const handleDifficultyChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setDifficulty(e.target.value as string);
  };

  const handleTopicChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setTopic(e.target.value as string);
  };

  const handleFindMatch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !token) {
      throw new Error("User is not logged in.");
    }

    try {
      await findMatch(user.id, topic, difficulty);
      // Start the timer if the match request is submitted successfully
      setIsMatching(true);
      setTimer(30);
      setNoMatchFound(false); // Reset the "No match found" message
    } catch (error) {
      console.error("Error submitting match request:", error);
      setIsMatching(false);
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Select Match Settings
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="difficulty-label">Select Difficulty Level</InputLabel>
          <Select
            labelId="difficulty-label"
            id="difficulty"
            value={difficulty}
            label="Select Difficulty Level"
            onChange={handleDifficultyChange}
            disabled={isMatching}
          >
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="topic-label">Select Topic</InputLabel>
          <Select
            labelId="topic-label"
            id="topic"
            value={topic}
            label="Select Topic"
            onChange={handleTopicChange}
            disabled={isMatching}
          >
            {topics.map((topicName) => (
              <MenuItem key={topicName} value={topicName}>
                {topicName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleFindMatch}
          disabled={isMatching}
          sx={{ mt: 2 }}
        >
          {isMatching ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} /> Matching ({timer}s)
            </>
          ) : (
            'Match'
          )}
        </Button>

        {noMatchFound && (
          <Typography sx={{ color: 'red', mt: 2 }}>
            No match found.
          </Typography>
        )}
      </Box>
    </>
  );
};

export default MatchSelection;
