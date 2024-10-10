import io from "socket.io-client";

const MATCH_WEBSOCKET_URL: string = "ws://localhost:3001";

const MatchingModal: React.FC = () => {
    const socket = io(MATCH_WEBSOCKET_URL, { autoConnect: false });

    async function handleFindMatchRequest() {
        const res = await fetch("http://localhost:3000/match/findMatch", {
            mode: "cors",
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:3000",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "Mike2",
                matchId: "123",
                topic: "algorithm",
                difficulty: "hard"
            })
        });
        const matchId = await res.json();
        console.log(matchId);

        socket.connect();
        socket.on("connect", () => {
            console.log("Connected to server", socket.id);
            socket.emit("joinMatchResponseRoom", matchId);

            socket.on("receiveMatchResponse", (data, ack) => {
                console.log("Received match response:", data);
                ack(true);
                socket.disconnect();
            });
            console.log(`Listening to room: ${matchId.matchId}`)
        });

        socket.on("disconnect", () => {
            socket.off();
            console.log("Disconnected from server");
        });
    }

  return (
    <div>
        <div>Connected</div>
        <button onClick={handleFindMatchRequest}>Find Match here</button>
    </div>
  );
};

export default MatchingModal;
