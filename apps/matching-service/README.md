# Matching Service

The Matching Service provides a WebSocket server to manage real-time matching requests through WebSocket connections. It is implemented in Go and uses the Gorilla WebSocket package to facilitate communication.

## Setup

1. Navigate to the matching service directory:

```bash
cd ./apps/matching-service
```

2. Ensure that you have Go installed. Install the necessary dependencies:

```bash
go mod tidy
```

3. Start the WebSocket server:

```bash
go run main.go
```

## API Usage

To establish a WebSocket connection with the matching service, use the following JavaScript code:

```javascript
const ws = new WebSocket("ws://localhost:8081/ws");
```

### Authentication

The initial WebSocket request should include a JWT token that contains the user’s ID as a claim. This token will be verified by the server to authenticate the user. The user ID extracted is used to identify the client and facilitate the matching process.

### Matching Workflow

1. **Sending Matching Parameter**s: Once the WebSocket connection is established, the client sends a message containing the matching parameters (e.g., preferred topics or difficulty levels).

2. **Receiving Match Results**:
   2.1. **Match Found**: If a match is found, the server sends the matching result back to the client via the WebSocket connection.
   2.2. **No Match Found**: If after a set amount of time, no match is found, the request timeouts, and the server sends a message that the matching failed.

3. **Connection Closure**:
   3.1. **Received Match Result**: After sending the match result, the server closes the connection.
   3.2. **Cancellation**: If the user cancels the matching process, the client should close the connection. The server will recognize this and cancel the ongoing match.

### Message Formats

Provide the structure of the messages being sent back and forth between the server and the client. This includes the format of the initial matching parameters and the response payload. All requests should be in JSON and contain the `type` field to handle different types of messages.

Client sends matching parameters:

```json
{
  "type": "match_request",
  "topics": ["Algorithms", "Arrays"],
  "difficulties": ["Easy", "Medium"]
}
```

Server response on successful match:

```json
{
  "type": "match_found",
  "matchID": "67890",
  "partnerID": "54321",
  "partnerName": "John Doe"
}
```

If no match is found after a set period of time, the server will send a timeout message:

```json
{
  "type": "timeout",
  "message": "No match found. Please try again later."
}
```

If the server encounters an issue during the WebSocket connection or processing, an error message will be sent back to the client before closing the connection. The client should handle these errors appropriately.

Sample error structure:

```json
{
  "type": "error",
  "message": "Invalid token"
}
```

### Environment Variables

- `PORT`: Specifies the port for the WebSocket server. Default is `8081`.
- `JWT_SECRET`: The secret key used to verify JWT tokens.
- `MATCH_TIMEOUT`: The time in seconds to wait for a match before timing out. Default is `60` seconds.

TODO: Add section for docker
