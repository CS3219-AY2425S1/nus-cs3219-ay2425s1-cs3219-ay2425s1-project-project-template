"use client"

import { useState, useEffect } from "react";
import { socket } from "../../services/sessionSocketService";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useRouter } from "next/navigation";

export default function TerminateModal() {
    const [isModalVisible, setModalVisibility] = useState<boolean>(false);
    const [userConfirmed, setUserConfirmed] = useState<boolean>(false);
    const router = useRouter();

    const openModal = async () => {
        setModalVisibility(true);
        const resolvedSocket = await socket;
        resolvedSocket?.emit("changeModalVisibility", true);
    };

    const closeModal = async () => {
        setModalVisibility(false);
        const resolvedSocket = await socket;
        resolvedSocket?.emit("changeModalVisibility", false);
    };

    const handleConfirm = async () => {
        setUserConfirmed(true);
        const resolvedSocket = await socket;
        resolvedSocket?.emit("userConfirmedTermination");
    };

    useEffect(() => {
        (async () => {
            const resolvedSocket = await socket;

            resolvedSocket?.on("modalVisibility", (isVisible: boolean) => {
                // console.log("Received modal visibility", isVisible);
                setModalVisibility(isVisible);
            });
        })();

        return () => {
            (async () => {
                const resolvedSocket = await socket;
                resolvedSocket?.off("modalVisibility");
            })();
        };
    }, []);



    return (
        <div className="flex justify-center items-center h-full w-full">
            <Button
                className=""
                variant="flat"
                color="danger"
                onClick={openModal}
            >
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
                        <p className="text-center">Both users need to confirm to terminate the session.</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            className=""
                            variant="flat"
                            color="danger"
                            onClick={handleConfirm}
                            disabled={userConfirmed}
                        >
                            {userConfirmed ? "Waiting for other user..." : "Confirm Termination"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
