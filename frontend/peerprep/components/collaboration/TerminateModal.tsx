"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { socket } from "../../services/sessionService";

interface TerminateModalProps {
  isModalVisible: boolean;
  userConfirmed: boolean;
  isCancelled: boolean;
  isFirstToCancel: boolean;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  handleConfirm: () => void;
  setIsCancelled: (isCancelled: boolean) => void;
}

export default function TerminateModal({
  isModalVisible,
  userConfirmed,
  isCancelled,
  isFirstToCancel,
  handleOpenModal: openModal,
  handleCloseModal: closeModal,
  handleConfirm,
  setIsCancelled,
}: TerminateModalProps) {
  // const [isModalVisible, setModalVisibility] = useState<boolean>(false);
  // const [userConfirmed, setUserConfirmed] = useState<boolean>(false);
  // const [isCancelled, setIsCancelled] = useState<boolean>(false); // Is termination cancelled
  // const [isFirstToCancel, setIsFirstToCancel] = useState<boolean>(true);
  // const router = useRouter();

  // const openModal = async () => {
  //   setModalVisibility(true);
  //   const resolvedSocket = await socket;

  //   resolvedSocket?.emit("changeModalVisibility", true);
  // };

  // const closeModal = async () => {
  //   setModalVisibility(false);
  //   setUserConfirmed(false);
  //   setIsFirstToCancel(true);
  //   const resolvedSocket = await socket;

  //   resolvedSocket?.emit("changeModalVisibility", false);
  // };

  // const handleConfirm = async () => {
  //   setUserConfirmed(true);
  //   if (isFirstToCancel) {
  //     const resolvedSocket = await socket;

  //     resolvedSocket?.emit("terminateOne");
  //   } else {
  //     setModalVisibility(false);
  //     const resolvedSocket = await socket;

  //     resolvedSocket?.emit("terminateSession");
  //     resolvedSocket?.disconnect();
  //     router.push("/");
  //   }
  // };

  // useEffect(() => {
  //   (async () => {
  //     const resolvedSocket = await socket;

  //     resolvedSocket?.on("modalVisibility", (isVisible: boolean) => {
  //       // console.log("Received modal visibility", isVisible);
  //       setModalVisibility(isVisible);
  //       setIsCancelled(!isVisible);

  //       if (!isVisible) {
  //         setUserConfirmed(false);
  //         setIsFirstToCancel(true);
  //       }
  //     });

  //     resolvedSocket?.on("terminateOne", () => {
  //       console.log("Partner confirmed termination");
  //       setIsFirstToCancel(false);
  //     });

  //     resolvedSocket?.on("terminateSession", () => {
  //       setModalVisibility(false);
  //       console.log("Session terminated");
  //       resolvedSocket?.disconnect();
  //       router.push("/");
  //     });
  //   })();

  //   return () => {
  //     (async () => {
  //       const resolvedSocket = await socket;

  //       resolvedSocket?.off("modalVisibility");
  //     })();
  //   };
  // }, []);

  return (
    <div className="flex justify-center items-center h-full w-full">
      <Button className="" variant="flat" color="danger" onClick={openModal}>
        Terminate Session
      </Button>
      <Modal
        isOpen={isModalVisible}
        onClose={closeModal}
        title="Session Terminated"
        aria-labelledby="Termination Modal"
        aria-describedby="Modal to confirm termination of session"
      >
        <ModalContent>
          <ModalHeader className="font-sans flex flex-col pt-8">
            <p className="text-xl font-bold pb-2 text-center">
              Ready to end the session?
            </p>
          </ModalHeader>
          <ModalBody>
            <p className="text-center">
              Both users need to confirm to terminate the session.
            </p>
          </ModalBody>
          <ModalFooter>
            <div className="flex flex-row justify-center items-center w-full">
              <Button
                className=""
                variant="flat"
                color="danger"
                onClick={handleConfirm}
                disabled={userConfirmed}
              >
                {userConfirmed
                  ? "Waiting for other user..."
                  : isFirstToCancel
                    ? "Confirm Termination"
                    : "Other user confirmed. Click to confirm."}
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isCancelled} onClose={() => setIsCancelled(false)}>
        <ModalContent>
          <ModalHeader className="font-sans flex flex-col">
            <p className="text-center">Termination Cancelled.</p>
          </ModalHeader>
        </ModalContent>
      </Modal>
    </div>
  );
}
