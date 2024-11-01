import * as fs from 'fs/promises';
import { exec } from 'child_process';

const extensions = { python3: 'py', c: 'c', cpp: 'cpp', java: 'java' };

export async function runCode(
  code: string,
  lang: string,
  input: string,
  timeout: number,
): Promise<{ stdout: string; stderr: string }> {
  const folder = `./code/${Date.now()}`;
  await fs.mkdir(folder, { recursive: true });

  const sourceFile = `${folder}/solution.${extensions[lang]}`;
  const inputFile = `${folder}/input.txt`;
  const outputFile = `${folder}/output.txt`;

  await fs.writeFile(sourceFile, code);
  await fs.writeFile(inputFile, input);

  // Input -> Generates output
  // Compare generated output with expected output

  let compileCommand = '';
  let runCommand = `timeout ${timeout} `;

  if (lang === 'java') {
    compileCommand = `javac ${sourceFile}`;
    runCommand += `java -cp ${folder} main < ${inputFile}`;
  } else if (lang === 'python3') {
    runCommand += `python3 ${sourceFile} < ${inputFile}`;
  }

  try {
    // Compile the code if required
    if (compileCommand) {
      await executeCommand(compileCommand);
    }

    const { stdout, stderr } = await executeCommand(runCommand);

    return { stdout, stderr };
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
        reject({ stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
