# Code Execution Service API Documentation

## Base URL

```url
http://code-execution-service-backend/api/codex/
```

## Security

The client will require a valid JWT created from our user service to use our endpoints.

## Endpoint

### POST /executeCode

Executes code in a specified programming language within a Docker container, optionally with input.

#### Request

- **Headers**:

  - `Content-Type: application/json`

- **Body Parameters**:
  - `code` (string, required): The code snippet to be executed.
  - `language` (string, required): The programming language for the code snippet (allowed values: `"python"`, `"javascript"`, `"cpp"`).
  - `input` (string, optional): Input to be passed to the code during execution.

#### Example Request

```json
{
  "code": "num1 = int(input())\nnum2 = int(input())\nsum_result = num1 + num2\nprint(f'The sum of {num1} and {num2} is {sum_result}')",
  "language": "python",
  "input": "20\n30"
}
```

#### Response

- **Success Response (200)**:

  - **Content**:

    ```json
        {
        "output": "The sum of 20 and 30 is 50\n"

    }
    ```

  - **Description**: Returns the output of the executed code.

- **Error Responses**:

  - **400 Bad Request**:

    - **Content**:

      ```json
      {
        "error": "Code and language are required."
      }
      ```

    - **Description**: Indicates that either `code` or `language` was not provided in the request.

  - **400 Unsupported Language**:

    - **Content**:

      ```json
      {
        "error": "Unsupported language."
      }
      ```

    - **Description**: Indicates that the provided `language` is not supported.

  - **500 Internal Server Error**:

    - **Content**:

      ```json
      {
        "error": "<error message>"
      }
      ```

    - **Description**: Indicates an error during code execution or an unknown server error.

#### Example Response

```json
{
  "output": "Hello, world!"
}
```

## Docker Execution Details

The code is executed inside a Docker container specific to the language provided:

- **Python**: Executes `.py` files using `python:latest`.
- **JavaScript**: Executes `.js` files using `node:latest`.
- **C++**: Compiles and runs `.cpp` files using `gcc:latest`.

Each language uses `echo` to pass any input and mounts the temporary file read-only to prevent file modification.

## Error Handling

- If the provided language is unsupported, a `400` error with the message `"Unsupported language."` is returned.
- Errors encountered during execution (e.g., syntax errors) are returned in the `500` error response.
- Any unknown errors are logged on the server and return a generic error message to the client.

## Important Notes

1. **File Cleanup**: Temporary files created for code execution are deleted after the process to prevent storage accumulation.
2. **Security**: Ensure proper validation and sandboxing as running arbitrary code in Docker, even with restrictions, can have security implications.

## Additional Information

This service is designed to handle single file execution only and will require modifications for handling multi-file dependencies or projects.
