import { exec } from "child_process";
import util from "util";
import fs from "fs";
import os from "os";
import path from "path";

const execPromise = util.promisify(exec);

export async function executeCode(code: string, language: string = "javascript"): Promise<string> {
  // 15 seconds timeout if code runs too long
  const TIMEOUT = 15000;

  try {
    let dockerImage;
    switch (language) {
      case "javascript":
        dockerImage = "node:14";
        break;
      case "python":
        dockerImage = "python:3.9";
        break;
      default:
        throw new Error("Unsupported language");
    }

    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, `${Date.now()}.${language}`);

    fs.writeFileSync(filePath, code);

    const command = `docker run --rm -v "${filePath}:/codefile" ${dockerImage} ${language === "javascript" ? "node" : "python"} /codefile`;

    const { stdout, stderr } = await execPromise(command, { timeout: TIMEOUT });

    fs.unlinkSync(filePath);

    if (stderr) {
      return `Error executing code:\n${formatErrorMessage(stderr.trim())}`;
    }
    return stdout.trim();
  } catch (error) {
    console.error("Error executing code:", error);

    if ((error as any).killed) {
      return "TIME LIMIT EXCEEDED";
    }

    // Handle other errors
    if (error instanceof Error) {
      const stderr = (error as any).stderr || "";
      return `Error executing code:\n${formatErrorMessage(stderr.trim() || error.message)}`;
    }
    return "An unknown error occurred during code execution.";
  }
}

function formatErrorMessage(errorOutput: string): string {
  return errorOutput
    .split("\n")
    .filter(line => !line.includes("/codefile"))
    .join("\n");
}
