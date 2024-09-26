import React from "react";
import Calendar from "../components/Calendar";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Questions from "../components/Questions";
import Overview from "../components/Overview";
import Welcome from "../components/Welcome";

export default function Dashboard() {
  return (
    <div className="max-h-screen">
      <div className="overflow-hidden">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6">
            <div className="flex space-x-4">
              <Welcome userName="Alex" />
              <Calendar />
            </div>
            <div className="mt-4 flex space-x-4">
              <Overview dataPoints={[10, 20, 15, 30, 40, 35, 50]} />
              <Questions />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
