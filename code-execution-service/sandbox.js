// sandbox.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const { NodeVM } = require('vm2');

const execPromise = util.promisify(exec);

// Method 1: Run code in Docker (language-agnostic)
async function runCodeInDocker(code, language) {
    const fileName = language === 'python' ? 'tempCode.py' : 'tempCode.js';
    const filePath = path.join(__dirname, fileName);

    fs.writeFileSync(filePath, code);

    let dockerCommand;
    if (language === 'python') {
        dockerCommand = `docker run --rm -v "${filePath}:/tempCode.py" python:latest python /tempCode.py`;
    } else {
        dockerCommand = `docker run --rm -v "${filePath}:/tempCode.js" node:latest node /tempCode.js`;
    }

    try {
        const { stdout, stderr } = await execPromise(dockerCommand);
        return { output: stdout, error: stderr };
    } catch (error) {
        return { output: null, error: error.message };
    } finally {
        fs.unlinkSync(filePath);
    }
}

// Method 2: Run JavaScript code using vm2
function runCodeInVm2(code) {
  let output = '';  // Variable to capture console output

  // Redirect `console.log` in the sandbox
  const vm = new NodeVM({
      timeout: 1000,
      sandbox: {
          console: {
              log: (...args) => { output += args.join(' ') + '\n'; }
          }
      }
  });

  try {
      vm.run(code);
      return { output: output.trim(), error: null };
  } catch (error) {
      return { output: null, error: error.message };
  }
}

module.exports = { runCodeInDocker, runCodeInVm2 };
