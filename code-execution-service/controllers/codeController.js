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

    let filename, command;

    // Set filename and command based on language
    switch (language) {
      case 'python':
        filename = 'tempCode.py';
        command = `echo "${input}" | python3 ${path.join(codeDir, filename)}`;
        break;
      case 'javascript':
        filename = 'tempCode.js';
        command = `echo "${input}" | node ${path.join(codeDir, filename)}`;
        break;
      case 'cpp':
        filename = 'tempCode.cpp';
        command = `g++ ${path.join(codeDir, filename)} -o ${path.join(codeDir, 'tempCode')} && echo "${input}" | ${path.join(codeDir, 'tempCode')}`;
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language.' });
    }

    // Save code to file
    const filePath = path.join(codeDir, filename);
    fs.writeFileSync(filePath, code);

    // Execute code
    exec(command, (error, stdout, stderr) => {
      // Clean up generated files after execution
      fs.unlinkSync(filePath);
      if (language === 'cpp') {
        fs.unlinkSync(path.join(codeDir, 'tempCode'));
      }

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
