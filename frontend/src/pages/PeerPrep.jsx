import React from "react";
import Header from "../components/Header";
import { ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar";

const firstname = "Jared";
const lastname = "Wong";
const fullname = firstname + " " + lastname;
const username = "wongjared";

const PeerPrep = ({ children }) => {
  return (
    <div>
      <div className="max-h-screen">
        <ToastContainer />
        <div className="flex h-screen flex-col overflow-hidden">
          <header className="sticky top-0 z-10 w-full">
            <Header name={fullname} username={username} />
          </header>
          <div className="flex flex-1 overflow-hidden">
            <aside className="sticky top-0 h-full">
              <Sidebar />
            </aside>

            <main className="flex-1 overflow-auto rounded-3xl px-6 py-4">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerPrep;
