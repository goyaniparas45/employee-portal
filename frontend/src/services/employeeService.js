import authClient from "./interceptor/axiosInterceptor";

import API_URL from "../config/config";

// Fetch all Roles
export const fetchRoles = async () => {
  const response = await authClient.get(`${API_URL}/roles`);
  return response.data;
};

// Fetch all employees
export const fetchEmployees = async () =>
  await authClient.get(`${API_URL}/employee`);

// Add a new employee
export const addEmployee = async (employee) =>
  await authClient.post(`${API_URL}/employee`, employee);

// Update an existing employee
export const updateEmployee = async (id, employee) =>
  await authClient.put(`${API_URL}/employee/${id}`, employee);

// Delete an employee by ID
export const deleteEmployee = async (id) =>
  await authClient.delete(`${API_URL}/employee/${id}`);
