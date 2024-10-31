export interface TestCase {
    input: any
    expected: any
}

export interface ExecutionResult {
    input: any,
    expected: any,
    output: any
    passed: boolean
}

export const languageExtensions = new Map([
    ["javascript", "js"],
    ["python", "py"]
])