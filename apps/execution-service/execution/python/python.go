package python

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"strings"
)

// RunPythonCode executes the provided Python code with the given input
func RunPythonCode(code string, input string) (string, string, error) {
	// Create a temporary Python file to execute
	tmpFile, err := os.CreateTemp("", "*.py")
	if err != nil {
		return "", "", fmt.Errorf("failed to create temporary file: %w", err)
	}
	defer os.Remove(tmpFile.Name()) // Clean up the temporary file afterwards

	// Write the provided code to the temporary file
	if _, err := tmpFile.WriteString(code); err != nil {
		return "", "", fmt.Errorf("failed to write code to temporary file: %w", err)
	}
	if err := tmpFile.Close(); err != nil {
		return "", "", fmt.Errorf("failed to close temporary file: %w", err)
	}

	// Prepare the command to execute the Python script
	cmd := exec.Command("python3", tmpFile.Name())
	cmd.Stdin = bytes.NewBufferString(input)

	// Capture the output and error
	var output bytes.Buffer
	var errorOutput bytes.Buffer
	cmd.Stdout = &output
	cmd.Stderr = &errorOutput

	// Run the command
	if err := cmd.Run(); err != nil {
		return "", fmt.Sprintf("Command execution failed: %s: %w", errorOutput.String(), err), nil
	}

	return strings.TrimSuffix(output.String(), "\n"), strings.TrimSuffix(errorOutput.String(), "\n"), nil
}
