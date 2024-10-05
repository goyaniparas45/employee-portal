import { NavLink } from "react-router-dom";
import { HiOutlineUsers, HiOutlineClipboardList } from "react-icons/hi";
import { getUserData } from "../services/authService";
const Sidebar = () => {
  const data = getUserData();

  return (
    <div className="w-64 h-screen bg-gray-800 text-white shadow-lg">
      <div className="py-6 pr-6 text-center  text-xl font-bold">
        Admin Panel
      </div>
      <nav className="flex flex-col py-4 px-6">
        <ul className="space-y-2">
          <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-400">
            MENU
          </h3>
          {data.role === "hr" ||
            (data.role === "admin" && (
              <>
                <li>
                  <NavLink
                    to="/admin/employees"
                    className={({ isActive }) =>
                      `flex items-center justify-start h-12 px-4 rounded hover:bg-gray-700 transition ${
                        isActive ? "bg-gray-600 text-yellow-300" : "text-white"
                      }`
                    }>
                    <HiOutlineUsers className="mr-2" />
                    Employees
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/tasks"
                    className={({ isActive }) =>
                      `flex items-center justify-start h-12 px-4 rounded hover:bg-gray-700 transition ${
                        isActive ? "bg-gray-600 text-yellow-300" : "text-white"
                      }`
                    }>
                    <HiOutlineClipboardList className="mr-2" />
                    Tasks
                  </NavLink>
                </li>
              </>
            ))}
          {data.role === "employee" && (
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `flex items-center justify-start h-12 px-4 rounded hover:bg-gray-700 transition ${
                    isActive ? "bg-gray-600 text-yellow-300" : "text-white"
                  }`
                }>
                <HiOutlineClipboardList className="mr-2" />
                Dashboard
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
