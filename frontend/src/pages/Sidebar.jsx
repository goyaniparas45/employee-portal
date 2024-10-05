import { AiOutlineLogout } from "react-icons/ai";
import { HiOutlineClipboardList, HiOutlineUsers } from "react-icons/hi";
import { MdPassword } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { getUserData } from "../services/authService";

const Sidebar = () => {
  const data = getUserData();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white shadow-lg">
      <div className="py-6 pr-6 text-center  text-xl font-bold">
        Admin Panel
      </div>
      <nav className=" py-4 px-6 h-[calc(100%-130px)]">
        <ul className="flex flex-col gap-2 h-full">
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
          <hr />
          <li>
            <NavLink
              to="/admin/change-password"
              className={({ isActive }) =>
                `flex items-center justify-start h-12 px-4 rounded hover:bg-gray-700 transition ${
                  isActive ? "bg-gray-600 text-yellow-300" : "text-white"
                }`
              }>
              <MdPassword className="mr-2" />
              Change password
            </NavLink>
          </li>
          <div className="mt-auto">
            <hr />
            <li className="mt-2">
              <NavLink
                onClick={handleLogout}
                className="flex items-center justify-start h-12 px-4 rounded hover:bg-gray-700 transition">
                <AiOutlineLogout className="mr-2" />
                Logout
              </NavLink>
            </li>
            <li className="text-center mt-5">v0.0.1</li>
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
