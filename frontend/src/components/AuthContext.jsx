import { createContext, useState, useEffect, useContext } from "react";
import {
  getToken,
  setToken,
  removeToken,
  setUserData,
  getUserData,
} from "../services/authService";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      getUserData();
    }
  }, []);

  const login = (token, data) => {
    setToken(token);
    setUserData(data);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken();
    setUserData(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  return useContext(AuthContext);
};
