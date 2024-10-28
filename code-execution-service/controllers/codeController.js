const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Code execution logic
const executeCode = (req, res) => {
  try {
    const { code, language, input } = req.body; // Added input field

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required.' });
    }

    let dockerCommand;

    // Set Docker command based on language
    switch (language) {
      case 'python':
        dockerCommand = `echo '${code}' > /tempCode.py && echo '${input}' | python /tempCode.py`;
        break;
      case 'javascript':
        dockerCommand = `echo '${code}' > /tempCode.js && echo '${input}' | node /tempCode.js`;
        break;
      case 'cpp':
        dockerCommand = `echo '${code}' > /tempCode.cpp && g++ /tempCode.cpp -o /tempCode && ./tempCode`;
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language.' });
    }

    // Updated to run in a single shell command
    const runCommand = `docker run --rm -i ${language === 'python' ? 'python:latest' : language === 'javascript' ? 'node:latest' : 'gcc:latest'} sh -c "${dockerCommand}"`;

    exec(runCommand, (error, stdout, stderr) => {
      if (error) {
        return res.status(200).json({ output: stderr || error.message });
      }
      res.send({ output: stdout });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Unknown server error' });
  }
};

module.exports = { executeCode };
