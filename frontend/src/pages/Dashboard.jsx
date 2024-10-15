import React from "react";
import Calendar from "../components/Calendar";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Questions from "../components/Questions";
import ProgressOverview from "../components/ProgressOverview";
import Welcome from "../components/Welcome";
import History from "../components/History";
import { ToastContainer } from "react-toastify";
import PeerPrep from "./PeerPrep";

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


const firstname = "Jared";

export default function Dashboard() {
  return (
    <PeerPrep>
      <main className="flex-1 overflow-auto rounded-3xl">
        <div className="flex space-x-5">
          <Welcome username={firstname} />
          <ProgressOverview />
        </div>
        <div className="mt-5 flex space-x-5">
          <Questions isAdmin={false}/>
          <History sessions={peerSessions} />
          <Calendar />
        </div>
      </main>
    </PeerPrep>
  );
}
