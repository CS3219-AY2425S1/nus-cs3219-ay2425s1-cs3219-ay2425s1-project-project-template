import io from "socket.io-client";

const MATCH_WEBSOCKET_URL: string = "ws://localhost:3001";

const MatchingModal: React.FC = () => {
    const socket = io(MATCH_WEBSOCKET_URL, { autoConnect: false });
    var matchId: string;
    var topic: string = "algorithm";
    var difficulty: string = "hard";

    async function handleFindMatchRequest() {
        const res = await fetch("http://localhost:3000/match/findMatch", {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "Mike2",
                topic: topic,
                difficulty: difficulty
            })
        });
        matchId = (await res.json()).matchId;

        socket.connect();
        socket.on("connect", () => {
            console.log("Connected to server", socket.id);
            socket.emit("joinMatchResponseRoom", matchId);

            socket.on("receiveMatchResponse", (data, ack) => {
                console.log("Received match response:", data);
                ack(true);
                socket.disconnect();
            });
            console.log(`Listening to room: ${matchId}`)
        });

        socket.on("disconnect", () => {
            socket.off();
            console.log("Disconnected from server");
        });
    }

    async function handleCancelMatchRequest() {
        console.log(`Cancelling request of matchId: ${matchId}`);
        await fetch(`http://localhost:3000/match/cancelMatch?matchId=${matchId}&topic=${topic}&difficulty=${difficulty}`, {
            mode: "cors",
            method: "DELETE",
        });
        socket.disconnect();
    }

  return (
    <div>
        <div>Connected</div>
        <button onClick={handleFindMatchRequest}>Find Match here</button>
        <button onClick={handleCancelMatchRequest}>Cancel match request! Ensure you press the above button first!!</button>
    </div>
  );
};

export default MatchingModal;
