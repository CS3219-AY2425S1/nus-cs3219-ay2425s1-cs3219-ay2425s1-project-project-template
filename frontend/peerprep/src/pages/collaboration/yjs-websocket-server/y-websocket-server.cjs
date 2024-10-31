const WebSocket = require("ws");
const { setupWSConnection } = require("y-websocket/bin/utils");
const http = require("http");

const port = 1234;
const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const roomId = url.searchParams.get("roomId"); // Extract roomId from query parameter
  setupWSConnection(ws, req, { docName: roomId });
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

server.listen(port, () => {
  console.log(`Yjs WebSocket server is running on http://localhost:${port}`);
});
