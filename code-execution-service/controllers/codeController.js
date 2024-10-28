const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Ensure 'code/' directory exists
const codeDir = path.join(__dirname, '../code');
if (!fs.existsSync(codeDir)) {
  fs.mkdirSync(codeDir);
}

// Code execution logic
const executeCode = (req, res) => {
  try {
    const { code, language, input } = req.body; // Added input field

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required.' });
    }

    let filename, dockerCommand;

    // Set filename and Docker command based on language
    switch (language) {
      case 'python':
        filename = 'tempCode.py';
        dockerCommand = `echo "${input}" | docker run --rm -i -v "${codeDir}/${filename}:/tempCode.py:ro" python:latest python /tempCode.py`;
        break;
      case 'javascript':
        filename = 'tempCode.js';
        dockerCommand = `echo "${input}" | docker run --rm -i -v "${codeDir}/${filename}:/app/tempCode.js:ro" node:latest node /app/tempCode.js`;
        break;
      case 'cpp':
        filename = 'tempCode.cpp';
        dockerCommand = `echo "${input}" | docker run --rm -i -v "${codeDir}/${filename}:/tempCode.cpp:ro" gcc:latest sh -c "g++ /tempCode.cpp -o /tempCode && ./tempCode"`;
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language.' });
    }
    

    // Save code to file
    const filePath = path.join(codeDir, filename);
    fs.writeFileSync(filePath, code);

    // Execute code in Docker container
    exec(dockerCommand, (error, stdout, stderr) => {
      // Clean up the generated file after execution
      fs.unlinkSync(filePath);

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
