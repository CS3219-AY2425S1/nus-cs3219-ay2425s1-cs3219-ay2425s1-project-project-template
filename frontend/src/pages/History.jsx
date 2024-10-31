import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import GeneralNavbar from "../components/navbar/GeneralNavbar";
import HistoryTable from "../components/history/HistoryTable";
import useAuth from "../hooks/useAuth";
import "../styles/History.css";

const History = () => {
  //const navigate = useNavigate();
  const { history } = useAuth();
  

  return (<>
      <GeneralNavbar />
      <div history-container>
        <HistoryTable history={history}/>
      </div>
  </>);
};

export default History;