import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Daftarkan komponen Chart.js yang akan kita gunakan
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WeeklyMovementChart = ({ chartData, titleText }) => {
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        // Gunakan prop 'titleText'
        text: titleText || 'Pergerakan Stok', // <-- MODIFIKASI
      },
    },
    // ... (scales)
  };

  const data = {
    labels: chartData.labels,
    datasets: chartData.datasets.map(dataset => ({
      ...dataset,
    })),
  };

  return <Bar options={options} data={data} />;
};

export default WeeklyMovementChart;