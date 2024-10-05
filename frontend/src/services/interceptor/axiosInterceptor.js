import axios from "axios";
import { getToken } from "../authService";
// import { useNavigate } from "react-router-dom";
import API_URL from "../../config/config";

const authClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

authClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // const navigate = useNavigate();
    // if (error.response && error.response.status === 401) {
    //   localStorage.removeItem("token");
    //   navigate("/login");
    // }
    return Promise.reject(error.response.data);
  }
);

export default authClient;
