import { useState } from "react";
import io from "socket.io-client";
import MatchingRequestForm from "./MatchingRequestForm";
import { MatchingRequestFormState } from "../../types/MatchingRequestFormState";
import Timer from "./timer";
import IsConnected from "../IsConnected";

interface MatchingModalProps {
  closeMatchingModal: () => void;
}

const MATCH_WEBSOCKET_URL: string = "ws://localhost:3001";

const MatchingModal: React.FC<MatchingModalProps> = ({
  closeMatchingModal,
}) => {
  // --- Declare your states ----
  const [matchId, setMatchId] = useState("");
  const [formData, setFormData] = useState<MatchingRequestFormState>({
    topic: "",
    difficulty: "",
  });

  const [isMatchFound, setIsMatchFound] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  const socket = io(MATCH_WEBSOCKET_URL, { autoConnect: false });

  async function handleFindMatchRequest(formData: MatchingRequestFormState) {
    const res = await fetch("http://localhost:3000/match/findMatch", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "test", // set up with user context later
        topic: formData.topic,
        difficulty: formData.difficulty,
      }),
    });
    const response = await res.json();
    setMatchId(response.matchId);
    console.log(response);

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
      `http://localhost:3000/match/cancelMatch?matchId=${matchId}&topic=${formData.topic}&difficulty=${formData.difficulty}`,
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
          onClick={() => {
            closeMatchingModal();
            handleCancelMatchRequest();
          }}
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
          {showTimer ? (
            <Timer />
          ) : (
            <MatchingRequestForm
              handleSubmit={() => handleFindMatchRequest(formData)}
              formData={formData}
              setFormData={setFormData}
            />
          )}
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
