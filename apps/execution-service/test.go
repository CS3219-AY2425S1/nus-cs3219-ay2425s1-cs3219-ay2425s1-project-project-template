package main

import (
	"execution-service/execution/python"
)

func main() {
	println("testing: ")
	output, errorOutput, _ := test()
	println("output: ", output)
	println("errorOutput: ", errorOutput)
}

//func test() bool {
//	inputOrOutput := `[]`
//
//	output := inputOrOutput
//
//	if output == "[]" {
//		return true
//	}
//
//	// Check that the output is enclosed in square brackets
//	if len(output) < 2 || output[0] != '[' || output[len(output)-1] != ']' {
//		return false
//	}
//
//	// Extract the content between square brackets
//	content := output[1 : len(output)-1]
//
//	// Split by commas without trimming spaces
//	sequences := strings.Split(content, ", ")
//	for _, seq := range sequences {
//		// Check if each sequence is properly enclosed in double quotes and is exactly 10 characters
//		if len(seq) != 12 || seq[0] != '"' || seq[11] != '"' {
//			return false
//		}
//
//		// Check that the sequence only contains valid DNA characters between the quotes
//		for i := 1; i < 11; i++ {
//			ch := seq[i]
//			if ch != 'A' && ch != 'C' && ch != 'G' && ch != 'T' {
//				return false
//			}
//		}
//	}
//	return true
//}

func test() (string, string, error) {
	code := `
nam = input()
print(name[::-1])
`

	input := "hello"

	return python.RunPythonCode(code, input)
}
