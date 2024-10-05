import API_URL from "../config/config";
import authClient from "./interceptor/axiosInterceptor";

// Fetch dashboard data
export const fetchDashboardData = async () => {
  const response = await authClient.get(`${API_URL}/dashboard`);
  return response.data;
};
