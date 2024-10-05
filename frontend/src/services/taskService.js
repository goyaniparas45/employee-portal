import authClient from "./interceptor/axiosInterceptor";
import API_URL from "../config/config";

// Fetch all tasks
export const fetchTasks = async () => {
  const response = await authClient.get(`${API_URL}/task`);
  return response.data;
};

// Add a new task
export const addTasks = async (task) => {
  const response = await authClient.post(`${API_URL}/task`, task);
  return response;
};

// Update an existing task
export const updateTasks = async (id, task) => {
  const response = await authClient.put(`${API_URL}/task/${id}`, task);
  return response;
};

// Delete a task by ID
export const deleteTasks = async (id) => {
  const response = await authClient.delete(`${API_URL}/task/${id}`);
  return response;
};

export const uploadDocument = async (file) => {
  const response = await authClient.post(`${API_URL}/upload`, file, {
    transformRequest: [(data) => data],
  });
  return response;
};
