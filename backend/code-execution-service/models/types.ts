export interface TestCase {
    input: string
    expectedOutput: string
}

export const languageExtensions = new Map([
    ["javascript", "js"],
    ["python", "py"]
])