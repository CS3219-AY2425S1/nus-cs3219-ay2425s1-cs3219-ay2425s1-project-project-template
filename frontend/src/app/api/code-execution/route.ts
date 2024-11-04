import { NextResponse } from 'next/server';
import axios from 'axios';

const CODE_EXECUTION_SERVICE_URL = process.env.NEXT_PUBLIC_CODE_EXECUTION_SERVICE_URL || 'http://localhost:9001/api/code-execution';

export interface CodeExecutionResponse {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testResults: Array<{
    testCaseNumber: number;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    error?: string;
    compilationError?: string | null;
  }>;
}

export interface ExecuteCodeParams {
  sessionId?: string;
  questionId: string;
  language: string;
  code: string;
  stdin?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as ExecuteCodeParams;
    const { sessionId, questionId, language, code, stdin } = body;

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    const response = await axios.post<CodeExecutionResponse>(
      CODE_EXECUTION_SERVICE_URL,  
      {
        sessionId, 
        questionId,
        language,
        code,
        stdin,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Code execution failed:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}
