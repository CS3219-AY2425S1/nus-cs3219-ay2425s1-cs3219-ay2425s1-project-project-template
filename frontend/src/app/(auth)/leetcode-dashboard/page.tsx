"use client";

import AddQuestionDialog from "@/app/(auth)/leetcode-dashboard/AddQuestionDialog";
import { LeetcodeDashboardTable } from "@/app/(auth)/leetcode-dashboard/LeetcodeDashboardTable";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import Modal from "react-modal";

const LeetcodeDashboardHeader = () => {
  return (
    <div className="flex flex-col mt-8">
      <span className="text-h3 font-medium text-white">
        Leetcode Admin Dashboard
      </span>
      <div className="flex flex-col text-white text-lg font-light">
        <span>
          For Admin users only: Interact with PeerPrep&apos;s Leetcode database!
        </span>
      </div>
    </div>
  );
};

const LeetcodeDashboard = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Container>
      <LeetcodeDashboardHeader />
      <div className="flex justify-end mb-4">
        <Button
          onClick={openModal}
          className="bg-yellow-500 hover:bg-yellow-300 text-black hover:text-primary-800 flex flex-row gap-2"
        >
          <PlusIcon />
          Add a Question
        </Button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            overlay: {
              backgroundColor: "rgba(29, 36, 51, 0.8)",
            },
          }}
        >
          <AddQuestionDialog setClose={closeModal} />
        </Modal>
      </div>
      <LeetcodeDashboardTable />
    </Container>
  );
};

export default LeetcodeDashboard;
