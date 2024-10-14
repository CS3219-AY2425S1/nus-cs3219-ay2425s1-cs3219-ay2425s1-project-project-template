let stompClient;

document.getElementById('connectButton').addEventListener('click', connect);
document.getElementById('sendMessageButton').addEventListener('click', sendMatchRequest);

function connect() {
    const socket = new SockJS('/matching-websocket');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
        // Subscribe to the user-specific queue
        stompClient.subscribe('/user/queue/matches', (message) => {
            console.log("Received a message from the server: ", message.body);
            document.getElementById('messages').innerHTML += `<p>Received: ${message.body}</p>`;
        });
    });
}

function sendMatchRequest() {
    const matchRequest = JSON.stringify({
        "useremail":  "xx",
        "topic": "xx",
        "language": "xx",
        "difficulty": "xx",
    });
    stompClient.send("/app/matchRequest", {}, matchRequest);
}
