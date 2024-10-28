import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import "typeface-montserrat";
import "./styles.scss";
import FindMatchContent from "./modalContent/FindMatchContent";
import MatchingInProgressContent from "./modalContent/MatchingInProgressContent";
import MatchFoundContent from "./modalContent/MatchFoundContent";
import JoinedMatchContent from "./modalContent/JoinedMatchContent";
import MatchNotFoundContent from "./modalContent/MatchNotFoundContent";
import MatchCancelledContent from "./modalContent/MatchCancelledContent";
import useMatching from "../services/use-matching";
import { useRouter } from "next/navigation";

interface MatchingModalProps {
  isOpen: boolean;
  close: () => void;
}

const MatchingModal: React.FC<MatchingModalProps> = ({
  isOpen,
  close: _close,
}) => {
  const router = useRouter();
  const matchingState = useMatching();
  const [closedType, setClosedType] = useState<
    "finding" | "cancelled" | "joined"
  >("finding");
  const [timeoutAfter, setTimeoutAfter] = useState<number>(9999);
  const isClosable = ["timeout", "closed"].includes(matchingState.state);

  function close() {
    // clean up matching and closedType State
    if (matchingState.state === "timeout") {
      matchingState.ok();
    }
    setClosedType("finding");
    _close();
  }

  const renderModalContent = () => {
    switch (matchingState.state) {
      case "closed":
        switch (closedType) {
          case "finding":
            return <FindMatchContent beginMatch={matchingState.start} />;
          case "cancelled":
            return (
              <MatchCancelledContent
                reselect={() => {
                  setClosedType("finding");
                }}
                retry={() => {}}
                canceledIn={timeoutAfter}
              />
            );
          case "joined":
            return (
              <JoinedMatchContent
                cancel={() => {
                  setClosedType("cancelled");
                }}
                name1={matchingState.info?.user || ""}
                name2={matchingState.info?.matchedUser || ""}
              />
            );
        }
      case "matching":
        return (
          <MatchingInProgressContent
            cancelMatch={(timeoutAfter: number) => {
              setClosedType("cancelled");
              setTimeoutAfter(timeoutAfter);
              matchingState.cancel();
            }}
            timeout={(timeoutAfter: number) => {
              matchingState.timeout();
              setTimeoutAfter(timeoutAfter);
            }}
          />
        );
      case "cancelling":
        return (
          <MatchingInProgressContent
            cancelMatch={() => {}}
            timeout={() => {}}
          />
        );
      case "starting":
        return <FindMatchContent beginMatch={() => {}} />;
      case "found":
        return (
          <MatchFoundContent
            cancel={() => {
              matchingState.ok();
              setClosedType("cancelled");
            }}
            join={() => {
              matchingState.ok();
              setClosedType("joined");
              localStorage.setItem("user", matchingState.info.user);
              localStorage.setItem(
                "matchedUser",
                matchingState.info.matchedUser
              );
              localStorage.setItem("collabId", matchingState.info.matchId);
              localStorage.setItem("questionDocRefId", matchingState.info.questionDocRefId);
              localStorage.setItem("matchedTopics", matchingState.info.matchedTopics.join(","));

              // Redirect to collaboration page
              router.push(`/collaboration/${matchingState.info.matchId}`);
            }}
            name1={matchingState.info.user}
            name2={matchingState.info.matchedUser}
          />
        );
      case "timeout":
        return (
          <MatchNotFoundContent
            reselect={matchingState.ok}
            retry={() => {}}
            timedOutIn={10}
          />
        );
      default:
        throw new Error("Invalid matching state.");
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={close}
      footer={null}
      closable={false}
      maskClosable={false}
      className="modal"
    >
      {renderModalContent()}
      {isClosable && (
        <button className="close-button" onClick={close}>
          Close
        </button>
      )}
    </Modal>
  );
};

export default MatchingModal;
