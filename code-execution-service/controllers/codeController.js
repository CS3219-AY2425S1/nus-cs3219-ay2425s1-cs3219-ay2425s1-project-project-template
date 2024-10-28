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
        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({ error: 'Code and language are required.' });
        }

        let filename, dockerCommand;

        // Set filename and Docker command based on language
        switch (language) {
            case 'python':
                filename = 'tempCode.py';
                dockerCommand = `docker run --rm -v "${codeDir}/${filename}:/tempCode.py:ro" python:latest python /tempCode.py`;
                break;
            case 'javascript':
                filename = 'tempCode.js';
                dockerCommand = `docker run --rm -v "${codeDir}/${filename}:/app/tempCode.js:ro" node:latest node /app/tempCode.js`;
                break;
            case 'cpp':
                filename = 'tempCode.cpp';
                dockerCommand = `docker run --rm -v "${codeDir}/${filename}:/tempCode.cpp:ro" gcc:latest sh -c "g++ /tempCode.cpp -o /tempCode && /tempCode"`;
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
                console.error("Execution error:", error);
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
