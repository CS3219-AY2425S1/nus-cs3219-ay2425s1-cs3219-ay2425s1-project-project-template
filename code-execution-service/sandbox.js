// sandbox.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execPromise = util.promisify(exec);

// Method 1: Run code in Docker (language-agnostic)
async function runCodeInDocker(code, language) {
    const fileName = language === 'python' ? 'tempCode.py' : 'tempCode.js';
    const filePath = path.join(__dirname, fileName);

    // Write the code to a temporary file
    fs.writeFileSync(filePath, code);

    // Determine the Docker command based on the language
    let dockerCommand;
    if (language === 'python') {
        dockerCommand = `docker run --rm -v "${filePath}:/tempCode.py:ro" python:latest python /tempCode.py`;
    } else if (language === 'javascript' || language === 'nodejs') {
        dockerCommand = `docker run --rm -v "${filePath}:/tempCode.js" node:latest node /tempCode.js`;
    } else {
        throw new Error('Unsupported language');
    }

    try {
        const { stdout, stderr } = await execPromise(dockerCommand);
        return { output: stdout, error: stderr };
    } catch (error) {
        return { output: null, error: error.message };
    } finally {
        fs.unlinkSync(filePath);  // Clean up the temporary file
    }
}

module.exports = { runCodeInDocker };
