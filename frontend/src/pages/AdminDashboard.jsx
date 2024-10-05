import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Sidebar from "../pages/Sidebar";
import Header from "../pages/Header";
import Employee from "../pages/Employee";
import Task from "../pages/Task";
import ViewEmployee from "../pages/ViewEmployee";
import PropTypes from "prop-types";
import { getUserData } from "../services/authService";

const AdminDashboard = ({ children }) => {
  const user = getUserData();
  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header />
          <div className="content flex-1 p-4 bg-gray-100">
            <Routes>
              <Route path="employees" element={<Employee />} />
              <Route path="tasks" element={<Task />} />
              <Route path="dashboard" element={<ViewEmployee />} />
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
