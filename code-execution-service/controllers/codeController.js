const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const crypto = require('crypto');

// Ensure 'code/' directory exists
const codeDir = path.join(__dirname, '../code');
if (!fs.existsSync(codeDir)) {
  fs.mkdirSync(codeDir);
}

// Code execution logic
const executeCode = (req, res) => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required.' });
    }

    // Generate a unique directory for each execution
    const uniqueDir = path.join(codeDir, crypto.randomUUID());
    fs.mkdirSync(uniqueDir);

    let filename, command;

    // Set filename and command based on language
    switch (language) {
      case 'python':
        filename = 'tempCode.py';
        command = `echo "${input}" | python3 ${path.join(uniqueDir, filename)}`;
        break;
      case 'javascript':
        filename = 'tempCode.js';
        command = `echo "${input}" | node ${path.join(uniqueDir, filename)}`;
        break;
      case 'cpp':
        filename = 'tempCode.cpp';
        command = `g++ ${path.join(uniqueDir, filename)} -o ${path.join(uniqueDir, 'tempCode')} && echo "${input}" | ${path.join(uniqueDir, 'tempCode')}`;
        break;
      default:
        fs.rmSync(uniqueDir, { recursive: true }); // Clean up directory
        return res.status(400).json({ error: 'Unsupported language.' });
    }

    // Save code to file
    const filePath = path.join(uniqueDir, filename);
    fs.writeFileSync(filePath, code);

    // Execute code
    exec(command, (error, stdout, stderr) => {
      // Clean up generated files and directory after execution
      fs.rmSync(uniqueDir, { recursive: true });

      if (error) {
        return res.status(500).json({ error: stderr || error.message });
      }
      res.send({ output: stdout });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Unknown server error' });
  }
};

module.exports = { executeCode };
