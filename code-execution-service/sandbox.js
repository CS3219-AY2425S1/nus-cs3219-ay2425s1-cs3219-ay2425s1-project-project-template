// sandbox.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const ivm = require('isolated-vm');

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
async function runCodeInIsolatedVm(code) {
  let prints = [];  // Array to capture console.log outputs

  // Create an isolated VM instance
  const isolate = new ivm.Isolate({ memoryLimit: 8 }); // Memory limit in MB
  const context = isolate.createContextSync();

  // Inject the `console.log` functionality to capture logs in `prints`
  const jail = context.global;
  jail.setSync('global', jail.derefInto());

  // Define console object with log function
  const consoleObj = {
    log: (msg) => {
      // Push the message to the prints array
      prints.push(msg);
    }
  };

  // Set console object in the global context
  await jail.setSync('console', consoleObj);

  // Wrap the code to capture the final result and print statements
  const wrappedCode = `
      (function() {
          ${code}
      })();
  `;

  // Execute the code in the VM and capture the final result
  let output;
  try {
    const script =  isolate.compileScriptSync(wrappedCode);
    output = await script.run(context, { timeout: 1000 });

    return {
      output: output === undefined ? null : output,
      prints: prints
    };
  } catch (error) {
    return { output: null, prints: prints, error: error.message };
  }
}

module.exports = { runCodeInDocker, runCodeInIsolatedVm };
