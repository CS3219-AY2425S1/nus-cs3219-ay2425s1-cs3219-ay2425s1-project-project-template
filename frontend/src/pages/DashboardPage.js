// src/pages/DashboardPage.js

import React, { useEffect, useState } from "react";
import Calendar from "../components/dashboard/Calendar"; // Import the Calendar component
import "./DashboardPage.css";

const DashboardPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  return (
    <div>
      <Calendar
        currentMonth={currentMonth}
        currentYear={currentYear}
        setCurrentMonth={setCurrentMonth}
        setCurrentYear={setCurrentYear}
      />
    </div>
  );
};

export default DashboardPage;
