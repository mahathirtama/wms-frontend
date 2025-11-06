import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

import DailyMovementChart from '../components/charts/DailyMovementChart'; 

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null); 



  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsResponse = await dashboardService.getStats();
        setStats(statsResponse.data);
      } catch (err) {
        setError("Gagal mengambil data KPI.");
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);


  useEffect(() => {
    const fetchChart = async () => {
      try {
        setLoadingChart(true);
        setError(null);

        const chartResponse = await dashboardService.getDailyMovementThisWeek(); 
        
        setChartData(chartResponse.data);
  

      } catch (err) {
        setError("Gagal mengambil data grafik harian.");
        setChartData(null);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchChart();
  }, []); 

 
  if (loadingStats || loadingChart) { 
     return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

   if (error) { 
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container-fluid">
      <h1 className="h2 mb-4">Dashboard</h1>

      <div className="row g-3">
  
         {/* Card 1 */}
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-muted small">Total Nilai Inventaris</h5>
              <p className="card-text fs-4 fw-bold">
                Rp {stats?.total_inventory_value?.toLocaleString('id-ID') ?? '0'}
              </p>
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-muted small">Total Kuantitas</h5>
              <p className="card-text fs-4 fw-bold">
                {stats?.total_inventory_quantity?.toLocaleString('id-ID') ?? '0'} Unit
              </p>
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-muted small">Total SKU</h5>
              <p className="card-text fs-4 fw-bold">
                {stats?.total_sku_count ?? '0'}
              </p>
            </div>
          </div>
        </div>
        {/* Card 4 */}
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-muted small">Open Purchase Orders</h5>
              <p className="card-text fs-4 fw-bold">
                {stats?.open_purchase_orders ?? '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Area untuk Grafik */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">

            
              {chartData && chartData.labels && chartData.labels.length > 0 ? (

                <DailyMovementChart chartData={chartData} /> 
              ) : (
                <p className="text-center text-muted p-5">Tidak ada pergerakan stok minggu ini.</p>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;