import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ChangePassword from "../components/ChangePassword";
import ProtectedRoute from "../components/ProtectedRoute";
import Employee from "../pages/Employee";
import Header from "../pages/Header";
import Sidebar from "../pages/Sidebar";
import Task from "../pages/Task";
import ViewEmployee from "../pages/ViewEmployee";
import { getUserData } from "../services/authService";
import { fetchUserPermission } from "../services/permissionService";
import { showErrorToast } from "../utils/toastUtils";

const AdminDashboard = ({ children }) => {
  const user = getUserData();
  const [permission, setPermission] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const permissions = await fetchUserPermission();
      setPermission(permissions);
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <ToastContainer />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header />
          <div className="content flex-1 p-4 bg-gray-100">
            <Routes>
              <Route
                path="employees"
                element={
                  <ProtectedRoute
                    module="employee"
                    permissions={permission}
                    permissionType="read"
                  >
                    <Employee />
                  </ProtectedRoute>
                }
              />

              <Route
                path="tasks"
                element={
                  <ProtectedRoute
                    module="employee"
                    permissions={permission}
                    permissionType="write"
                  >
                    <Task />
                  </ProtectedRoute>
                }
              />

              <Route
                path="dashboard"
                element={
                  <ProtectedRoute
                    module="dashboard"
                    permissions={permission}
                    permissionType="read"
                  >
                    <ViewEmployee />
                  </ProtectedRoute>
                }
              />
              <Route path="change-password" element={<ChangePassword />} />

              <Route
                path="*"
                element={
                  <Navigate
                    to={user.role === "employee" ? "dashboard" : "employees"}
                  />
                }
              />
            </Routes>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AdminDashboard.propTypes = {
  children: PropTypes.node,
};

export default AdminDashboard;
