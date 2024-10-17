export default function createWebSocket(socketId: string): WebSocket {
  const ws = new WebSocket(`ws://localhost:3002/ws?socket_id=${socketId}`);

  //   define openEvent handler
  ws.onopen = (event) => {
    console.log("Connected to Server");
    ws.send("Hello Server From Client");
  };

  //   define onClose behavior
  ws.onclose = (event) => {
    console.log("Succesfully closed connection");
  };

  // define error
  ws.onerror = (event) => {
    console.log("Error occured with WebSocket", event);
  };

  //   define behaviour for message
  ws.onmessage = (event) => {
    console.log(`Message Received From the Server: ${event.data}`);
  };

  return ws;
}
