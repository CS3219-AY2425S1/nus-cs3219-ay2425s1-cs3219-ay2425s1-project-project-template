import { useState } from "react";
import io from "socket.io-client";

const MATCH_WEBSOCKET_URL: string = "ws://localhost:8080";

const MatchingModal: React.FC = () => {

    // --- Declare your states ---- 
    const [matchId, setMatchId] = useState<string>("");
    const [name, setName] = useState<string>("Mike2"); // Example name, but can also be from an input
    const [topic, setTopic] = useState<string>("algorithm");
    const [difficulty, setDifficulty] = useState<string>("hard");
    const [isMatchFound, setIsMatchFound] = useState(false);

    const socket = io(MATCH_WEBSOCKET_URL, { autoConnect: false });

    async function handleFindMatchRequest() {
        const res = await fetch("http://localhost:3000/match/findMatch", {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                topic: topic,
                difficulty: difficulty
            })
        });
        const data = await res.json();
        setMatchId(data.matchId); // Save matchId in state

        socket.connect();
        socket.on("connect", () => {
            console.log("Connected to server", socket.id);
            socket.emit("joinMatchResponseRoom", data.matchId);

            socket.on("receiveMatchResponse", (response, ack) => {
                console.log("Received match response:", response);
                ack(true);
                socket.disconnect();
                // --- Successfully matched!!! ---
                // Change in some state here
                setIsMatchFound(true);
            });
            console.log(`Listening to room: ${data.matchId}`)
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
            <div>Found Match??: {isMatchFound ? <div>Found!</div> : <div>Not found yet</div>}</div>

            {/* Inputs for name, topic, and difficulty */}
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="topic">Topic:</label>
                <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="difficulty">Difficulty:</label>
                <input
                    type="text"
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                />
            </div>

            <button onClick={handleFindMatchRequest}>Find Match here</button>
            <button onClick={handleCancelMatchRequest}>Cancel match request! Ensure you press the above button first!!</button>
        </div>
    );
};

export default MatchingModal;
