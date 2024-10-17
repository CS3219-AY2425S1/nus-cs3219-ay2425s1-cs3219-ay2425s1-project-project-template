import { useState } from "react";
import io from "socket.io-client";
import IsConnected from "../IsConnected";

interface MatchingModalProps {
  closeMatchingModal: () => void;
}

const MATCH_WEBSOCKET_URL: string = "ws://localhost:3001";

const MatchingModal: React.FC<MatchingModalProps> = ({ closeMatchingModal }) => {
  // --- Declare your states ----
  var matchId: string;
  var topic: string = "algorithm";
  var difficulty: string = "hard";

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
        name: "Mike2",
        topic: topic,
        difficulty: difficulty,
      }),
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
        // --- Successfully matched!!! ---
        // Change in some state here
        setIsMatchFound(true);
      });
      console.log(`Listening to room: ${matchId}`);
    });

    socket.on("disconnect", () => {
      socket.off();
      console.log("Disconnected from server");
    });
  }

  async function handleCancelMatchRequest() {
    console.log(`Cancelling request of matchId: ${matchId}`);
    await fetch(
      `http://localhost:3000/match/cancelMatch?matchId=${matchId}&topic=${topic}&difficulty=${difficulty}`,
      {
        mode: "cors",
        method: "DELETE",
      }
    );
    socket.disconnect();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 bg-gray-800 bg-opacity-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg">
        <button
          onClick={closeMatchingModal}
          id="submit"
          className="absolute top-2 right-2 px-2 rounded-lg hover:bg-gray-200"
        >
          X
        </button>
        <div className="mb-4 text-lg font-semibold text-center">
          Found Match?:{" "}
          {isMatchFound ? (
            <div className="text-green-500">Found!</div>
          ) : (
            <div className="text-red-500">Not found yet</div>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleFindMatchRequest}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Find Match here
          </button>
          <button
            onClick={handleCancelMatchRequest}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
          >
            Cancel match request! Ensure you press the above button first!!
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchingModal;
