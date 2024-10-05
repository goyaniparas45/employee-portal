import authClient from "./interceptor/axiosInterceptor";
import API_URL from "../config/config";

// Signup API
export const signup = async (userData) =>
  await authClient.post(`${API_URL}/auth/register`, userData);

export const verifyCode = async (userData) =>
  await authClient.post(`${API_URL}/auth/verify-code`, userData);

// Login API
export const login = async (credentials) =>
  await authClient.post(`${API_URL}/auth/login`, credentials);

// Forgot Password API
export const forgotPassword = async (email) =>
  await authClient.post(`${API_URL}/auth/verify-code`, {
    email,
  });

// Store token in local storage
// Store user data in local storage
export const setUserData = (data) => {
  localStorage.setItem("user", JSON.stringify(data));
};

// Get user data from local storage
export const getUserData = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Remove user data from local storage
export const removeUserData = () => {
  localStorage.removeItem("user");
};
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Get token from local storage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Remove token from local storage
export const removeToken = () => {
  localStorage.removeItem("token");
};
