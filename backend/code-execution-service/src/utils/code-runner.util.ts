import * as fs from 'fs/promises';
import { exec } from 'child_process';

const extensions = { python3: 'py', c: 'c', cpp: 'cpp', java: 'java' };

export async function runCode(
  code: string,
  lang: string,
  input: string,
  timeout: number,
): Promise<{ output: string; stderr: string }> {
  const folder = `./temp/${Date.now()}`;
  await fs.mkdir(folder, { recursive: true });

  const sourceFile = `${folder}/source.${extensions[lang]}`;
  const inputFile = `${folder}/input.txt`;
  const outputFile = `${folder}/output.txt`;

  // Retrieve inputs from server
  // Compile and run code
  // Compare output with expected output
  // Server will need: list of inputs, list of expected outputs, code, language, timeout

  await fs.writeFile(sourceFile, code);
  await fs.writeFile(inputFile, input);

  let compileCommand = '';
  let runCommand = `timeout ${timeout} `;

  if (lang === 'java') {
    compileCommand = `javac ${sourceFile}`;
    runCommand += `java -cp ${folder} main < ${inputFile} > ${outputFile}`;
  } else if (lang === 'python3') {
    runCommand += `python3 ${sourceFile} < ${inputFile} > ${outputFile}`;
  }

  try {
    console.log('Called 1');
    if (compileCommand) {
      await executeCommand(compileCommand);
    }

    console.log('Called 2');
    const { stdout, stderr } = await executeCommand(runCommand);
    console.log('Called 3');

    const output = await fs.readFile(outputFile, 'utf-8');

    return { output, stderr };
  } finally {
    await fs.rm(folder, { recursive: true, force: true });
  }
}

function executeCommand(
  command: string,
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        // console.log('here');
        // console.log(error);
        // console.log('here');
        // console.log(stdout);
        // console.log('here');
        // console.log(stderr);
        reject(stderr);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
