import React from 'react';
import { Line } from 'react-chartjs-2'; // <-- Gunakan Line
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement, // <-- Untuk titik di garis
  LineElement,  // <-- Untuk garis
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Daftarkan komponen Chart.js yang akan kita gunakan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement, // <-- Baru
  LineElement,  // <-- Baru
  Title,
  Tooltip,
  Legend
);

const DailyMovementChart = ({ chartData }) => {
  
  // Opsi untuk grafik Line
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pergerakan Stok Minggu Ini (Harian)', // <-- Judul baru
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Data dari API (labels: Senin-Minggu, datasets: Masuk & Keluar)
  const data = {
    labels: chartData.labels,
    datasets: chartData.datasets.map(dataset => ({
      ...dataset,
      fill: false, // Jangan warnai area di bawah garis
    })),
  };

  return <Line options={options} data={data} />; // <-- Gunakan <Line />
};

export default DailyMovementChart;