import API_URL from "../config/config";
import authClient from "./interceptor/axiosInterceptor";

// Fetch all tasks
export const fetchUserPermission = async () => {
  const response = await authClient.get(`${API_URL}/auth/permission`);
  return response.data;
};
