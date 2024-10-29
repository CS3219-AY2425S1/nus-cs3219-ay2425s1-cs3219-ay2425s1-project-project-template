const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const crypto = require('crypto');

// Ensure 'code/' directory exists
const codeDir = path.join(__dirname, '../code');
if (!fs.existsSync(codeDir)) {
  fs.mkdirSync(codeDir);
}

// Set limits
const timeoutMilliseconds = 2000; // 2 seconds
const memoryLimit = '100000'; // Set memory limit to 100 MB in kilobytes
const cpuLimit = '2'; // Set CPU time limit to 2 seconds

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
        command = `ulimit -v ${memoryLimit} -t ${cpuLimit}; python3 ${path.join(uniqueDir, filename)} < ${path.join(uniqueDir, 'input.txt')}`;
        break;
      case 'javascript':
        filename = 'tempCode.js';
        command = `ulimit -v ${memoryLimit} -t ${cpuLimit}; node ${path.join(uniqueDir, filename)} < ${path.join(uniqueDir, 'input.txt')}`;
        break;
      case 'cpp':
        filename = 'tempCode.cpp';
        command = `ulimit -v ${memoryLimit} -t ${cpuLimit}; g++ ${path.join(uniqueDir, filename)} -o ${path.join(uniqueDir, 'tempCode')} && ${path.join(uniqueDir, 'tempCode')} < ${path.join(uniqueDir, 'input.txt')}`;
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

    // Execute the command with a timeout
    const execWithTimeout = (command, timeout) => {
      return new Promise((resolve, reject) => {
        const process = exec(command, (error, stdout, stderr) => {
          if (error) {
            reject(stderr || error.message);
          } else {
            resolve(stdout);
          }
        });

        // Kill the process if it exceeds the timeout
        setTimeout(() => {
          process.kill(); // Kill the process
          reject(new Error('Execution timed out'));
        }, timeout);
      });
    };

    // Execute the command with ulimit for memory and CPU limits
    execWithTimeout(command, timeoutMilliseconds)
      .then(output => {
        // Clean up generated files and directory after execution
        fs.rmSync(uniqueDir, { recursive: true });
        res.send({ output });
      })
      .catch(error => {
        // Clean up generated files and directory after execution
        fs.rmSync(uniqueDir, { recursive: true });
        console.error('Execution error:', error); // Log the error for debugging
        res.status(500).json({ error: error.message });
      });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Unknown server error' });
  }
};

module.exports = { executeCode };
