import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { getToken } from "../services/authService";

const PermissionProtectedRoute = ({ children, module, permissions, permissionType }) => {
  const isAuthenticated = getToken();
  return isAuthenticated ? (
    permissions[module] && permissions[module][permissionType] ? (
      children
    ) : (
      <Navigate to="/unauthorized" replace />
    )
  ) : (
    <Navigate to="/login" />
  );
};

PermissionProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  module: PropTypes.string.isRequired,
  permissions: PropTypes.object.isRequired,
  permissionType: PropTypes.string.isRequired,
};

export default PermissionProtectedRoute;
