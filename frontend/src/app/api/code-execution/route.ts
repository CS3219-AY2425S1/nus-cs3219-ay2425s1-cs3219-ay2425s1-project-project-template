import { NextResponse } from 'next/server';
import axios from 'axios';

const CODE_EXECUTION_SERVICE_URL = 'http://localhost:9000/api/code-execution';

export interface CodeExecutionResponse {
  output: string;
  stderr: string;
  stdout: string;
  exitCode: number;
  compile?: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
  };
}

// API Route Handler
export async function POST(request: Request) {
  try {
    console.log('HEREEEE code:', request.body);
    const body = await request.json();
    const { language, code, stdin } = body;

    const response = await axios.post<CodeExecutionResponse>(
      CODE_EXECUTION_SERVICE_URL,  // Removed extra /code-execution
      {
        language,
        code,
        stdin,
      }
    );

    console.log('Code execution response:', response.data);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Code execution failed:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}