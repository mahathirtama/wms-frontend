import apiClient from './apiClient';


const getStats = () => {
  return apiClient.get('/dashboard/stats');
};


const getWeeklyMovement = () => {
  return apiClient.get('/dashboard/weekly-movement');
};

const getDailyMovementThisWeek = () => {

  return apiClient.get('/dashboard/daily-movement-this-week'); 
};

export const dashboardService = {
  getStats,
  getWeeklyMovement,
  getDailyMovementThisWeek,
};