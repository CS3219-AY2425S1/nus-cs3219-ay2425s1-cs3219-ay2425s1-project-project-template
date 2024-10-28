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
      case 'java':
        filename = 'Main.java'; // java is picky with filenames
        dockerCommand = `docker run --rm -v "${codeDir}/${filename}:/app/${filename}:ro" openjdk:latest sh -c "javac /app/Main.java && java -cp /app Main"`;
        break;
      case 'csharp':
        filename = 'tempCode.cs';
        dockerCommand = `
        docker run --rm -v "${codeDir}/${filename}:/app/tempCode.cs" mcr.microsoft.com/dotnet/sdk:latest sh -c "dotnet new console -n MyApp -o /app/MyApp && cp /app/tempCode.cs /app/MyApp/Program.cs && cd /app/MyApp && dotnet run"
    `;
        break;
      case 'go':
        filename = 'tempCode.go';
        dockerCommand = `docker run --rm -v "${codeDir}/${filename}:/tempCode.go:ro" golang:latest go run /tempCode.go`;
        break;
      case 'ruby':
        filename = 'tempCode.rb';
        dockerCommand = `docker run --rm -v "${codeDir}/${filename}:/tempCode.rb:ro" ruby:latest ruby /tempCode.rb`;
        break;
      case 'swift':
        filename = 'tempCode.swift';
        dockerCommand = `docker run --rm -v "${codeDir}/${filename}:/tempCode.swift:ro" swift:latest swift /tempCode.swift`;
        break;
      case 'kotlin':
        filename = 'tempCode.kt';
        dockerCommand = `docker run --rm -v "${codeDir}/${filename}:/tempCode.kt:ro" openjdk:latest sh -c "kotlinc /tempCode.kt -include-runtime -d /tempCode.jar && java -jar /tempCode.jar"`;
        break;
      case 'rust':
        filename = 'tempCode.rs';
        dockerCommand = `docker run --rm -v "${codeDir}/${filename}:/tempCode.rs:ro" rust:latest sh -c "rustc /tempCode.rs -o /tempCode && ./tempCode"`;
        break;
      case 'typescript':
        filename = 'tempCode.ts';
        dockerCommand = `docker run --rm -v "${codeDir}/${filename}:/tempCode.ts:ro" node:latest sh -c "npm install -g typescript && tsc /tempCode.ts && node /tempCode.js"`;
        break;
      case 'php':
        filename = 'tempCode.php';
        dockerCommand = `docker run --rm -v "${codeDir}/${filename}:/tempCode.php:ro" php:latest php /tempCode.php`;
        break;
      case 'scala':
        filename = 'tempCode.scala';
        dockerCommand = `docker run --rm -v "${codeDir}/${filename}:/tempCode.scala:ro" scala:latest scala /tempCode.scala`;
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
