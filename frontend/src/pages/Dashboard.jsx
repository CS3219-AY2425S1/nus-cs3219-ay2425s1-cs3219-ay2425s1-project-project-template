import React from "react";
import Calendar from "../components/Calendar";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Questions from "../components/Questions";
import ProgressOverview from "../components/ProgressOverview";
import Welcome from "../components/Welcome";
import History from "../components/History"
import { ToastContainer } from "react-toastify";

const peerSessions = [
  {
    id: 1,
    date: "2024-09-21",
    peerName: "John Doe",
    topics: ["Arrays", "Sorting"],
    result: "Success",
  },
  {
    id: 2,
    date: "2024-09-21",
    peerName: "John Doe",
    topics: ["Arrays", "Sorting"],
    result: "Success",
  },
  {
    id: 3,
    date: "2024-09-21",
    peerName: "John Doe",
    topics: ["Arrays", "Sorting"],
    result: "Success",
  },
];

const suggestedQuestion = {
  title: "Binary Search Tree Insertion",
  category: "Data Structures",
};

export default function Dashboard() {
  return (
    <div className="max-h-screen">
      <ToastContainer />
      <div className="flex h-screen flex-col overflow-hidden">
        <header className="sticky top-0 z-10 w-full">
          <Header />
        </header>
        <div className="flex flex-1 overflow-hidden">
          <aside className="sticky top-0 h-full">
            <Sidebar />
          </aside>

          {/* Main content - Scrollable */}
          <main className="flex-1 overflow-auto rounded-3xl px-6 py-4">
            <div className="flex space-x-5">
              <Welcome username="Jared" suggestedQuestion={suggestedQuestion} />
              <ProgressOverview />
            </div>
            <div className="mt-5 flex space-x-5">
              <Questions />
              <History sessions={peerSessions} />
              <Calendar />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

