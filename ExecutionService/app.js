import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/execute', async (req, res) => {
  const { code, language } = req.body;

  const versionMap = {
    'cpp': '10.2.0',
    'java': '15.0.2',
    'javascript': '18.15.0',
    'python': '3.10.0'
  }

  // Piston API endpoint
  const apiEndpoint = 'https://emkc.org/api/v2/piston/execute';

  try {
    const response = await axios.post(apiEndpoint, {
      "language": String(language),
      "version": versionMap[String(language)],
      "files": [
          {
              "content": code
          }
      ],
    });

    // Return the output or errors in JSON format
    if (response) {
      if (response.data.run.stdout) {
        res.json({ output: response.data.run.stdout });
      } else {
        res.json({ output: response.data.run.stderr });
      }
    } else {
      res.json({ error: "Execution failed, no response received" });
    }
  } catch (error) {
    console.error("Error during code execution:", error.message);
    res.status(500).json({ error: "Failed to execute code." });
  }
});

app.listen(3010, () => console.log("Execution server running on port 3010"));