import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { getToken } from "../services/authService";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = getToken();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;
