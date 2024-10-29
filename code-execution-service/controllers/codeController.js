const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const crypto = require('crypto');

// Ensure 'code/' directory exists
const CODE_DIR = path.join(__dirname, '../code');
if (!fs.existsSync(CODE_DIR)) {
  fs.mkdirSync(CODE_DIR);
}

// Set limits
const EXECUTION_TIMEOUT_MS = 2000; // 2 seconds for execution
const COMPILATION_TIMEOUT_MS = 2000; // 2 seconds for compilation
const MEMORY_LIMIT_MB = 100; // Set memory limit to 100 MB

// Code execution logic
const executeCode = (req, res) => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required.' });
    }

    // Generate a unique directory for each execution
    const uniqueDir = path.join(CODE_DIR, crypto.randomUUID());
    fs.mkdirSync(uniqueDir);

    let filename, compileCommand, execCommand;

    // Set filename and commands based on language
    switch (language) {
      case 'python':
        filename = 'tempCode.py';
        execCommand = `python3 ${path.join(uniqueDir, filename)} < ${path.join(uniqueDir, 'input.txt')}`;
        break;
      case 'javascript':
        filename = 'tempCode.js';
        execCommand = `node ${path.join(uniqueDir, filename)} < ${path.join(uniqueDir, 'input.txt')}`;
        break;
      case 'cpp':
        filename = 'tempCode.cpp';
        compileCommand = `g++ ${path.join(uniqueDir, filename)} -o ${path.join(uniqueDir, 'tempCode')}`;
        execCommand = `${path.join(uniqueDir, 'tempCode')} < ${path.join(uniqueDir, 'input.txt')}`;
        break;
      default:
        fs.rmSync(uniqueDir, { recursive: true }); // Clean up directory
        return res.status(400).json({ error: 'Unsupported language.' });
    }

    // Write the code to the file in the unique directory
    const filePath = path.join(uniqueDir, filename);
    const inputFilePath = path.join(uniqueDir, 'input.txt');

    fs.writeFileSync(filePath, code);
    fs.writeFileSync(inputFilePath, input);

    // Function to execute a command with a timeout and custom error message
    const execWithTimeout = (command, timeout, errorMessage) => {
      return new Promise((resolve, reject) => {
        const process = exec(command, { timeout }, (error, stdout, stderr) => {
          if (error) {
            reject(new Error(errorMessage));
          } else {
            resolve(stdout);
          }
        });
      });
    };

    // Compile the C++ code with a time limit
    if (language === 'cpp') {
      execWithTimeout(compileCommand, COMPILATION_TIMEOUT_MS, 'Compilation timed out')
        .then(() => {
          // Now execute the compiled code with memory limit
          return execWithTimeout(execCommand, EXECUTION_TIMEOUT_MS, 'Execution timed out');
        })
        .then(output => {
          // Clean up generated files and directory after execution
          fs.rmSync(uniqueDir, { recursive: true });
          res.status(200).json({ output, is_error: false });
        })
        .catch(error => {
          // Clean up generated files and directory after execution
          fs.rmSync(uniqueDir, { recursive: true });
          res.status(200).json({ output: error.message, is_error: true });
        });
    } else {
      // For other languages, execute immediately
      execWithTimeout(execCommand, EXECUTION_TIMEOUT_MS, 'Execution timed out')
        .then(output => {
          // Clean up generated files and directory after execution
          fs.rmSync(uniqueDir, { recursive: true });
          res.status(200).json({ output, is_error: false });
        })
        .catch(error => {
          // Clean up generated files and directory after execution
          fs.rmSync(uniqueDir, { recursive: true });
          res.status(200).json({ output: error.message, is_error: true });
        });
    }

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Unknown server error' });
  }
};

module.exports = { executeCode };
