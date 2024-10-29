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
        command = `python3 ${path.join(uniqueDir, filename)} < ${path.join(uniqueDir, 'input.txt')}`;
        break;
      case 'javascript':
        filename = 'tempCode.js';
        command = `node ${path.join(uniqueDir, filename)} < ${path.join(uniqueDir, 'input.txt')}`;
        break;
      case 'cpp':
        filename = 'tempCode.cpp';
        command = `g++ ${path.join(uniqueDir, filename)} -o ${path.join(uniqueDir, 'tempCode')} && ${path.join(uniqueDir, 'tempCode')} < ${path.join(uniqueDir, 'input.txt')}`;
        break;
      default:
        fs.rmSync(uniqueDir, { recursive: true }); // Clean up directory
        return res.status(400).json({ error: 'Unsupported language.' });
    }

    // Now that filename is set, define filePath
    const filePath = path.join(uniqueDir, filename);
    const inputFilePath = path.join(uniqueDir, 'input.txt');

    // Write the code to the file in the unique directory
    fs.writeFileSync(filePath, code);

    // Write the input to 'input.txt' in the unique directory
    fs.writeFileSync(inputFilePath, input);

    // Execute the code file
    exec(command, (error, stdout, stderr) => {
      // Clean up generated files and directory after execution
      fs.rmSync(uniqueDir, { recursive: true });

      if (error) {
        return res.status(500).json({ error: stderr || error.message });
      }
      res.send({ output: stdout });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unknown server error' });
  }
};

module.exports = { executeCode };
