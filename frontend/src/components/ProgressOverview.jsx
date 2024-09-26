import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const ProgressOverview = ({ dataPoints }) => {
  const data = {
    labels: dataPoints.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: "Progress",
        data: dataPoints,
        borderColor: "#a3e635",
        backgroundColor: "rgba(163, 230, 53, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "white",
        },
        grid: {
          borderDash: [5, 5],
          color: "#555",
        },
      },
    },
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-gray-300/30 bg-[#191919] p-6 text-white">
      <h2 className="mb-4 text-lg font-semibold">Progress Overview</h2>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ProgressOverview;
