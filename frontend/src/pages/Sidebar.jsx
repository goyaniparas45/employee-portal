import PropTypes from "prop-types";
import { AiOutlineClose, AiOutlineLogout } from "react-icons/ai";
import { HiOutlineClipboardList, HiOutlineUsers } from "react-icons/hi";
import { MdPassword } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useConfirmAlert } from "react-use-confirm-alert";
import { useAuth } from "../components/AuthContext";
import { getUserData } from "../services/authService";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const data = getUserData();
  const confirm = useConfirmAlert();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    confirm({
      title: "Confirm Logout",
      message: "Are you sure you want to logout?",
      confirmButtonLabel:'Logout',
      onConfirm: async () => {
        logout();
        navigate("/login");
      },
      onCancel: {},
    });
  };

  return (
    <div>
      <div
        className={`fixed md:relative z-20 transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 h-screen bg-gray-800 text-white shadow-lg`}
      >
        <div className="py-6 pr-6 text-center text-xl font-bold">
          Admin Panel
        </div>
        <button className="md:hidden" onClick={toggleSidebar}>
          <AiOutlineClose className="absolute right-4 top-4 text-2xl" />
        </button>
        <nav className="py-4 px-6 h-[calc(100%-130px)]">
          <ul className="flex flex-col gap-2 h-full">
            <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-400">
              MENU
            </h3>
            {data.role === "hr" || data.role === "admin" ? (
              <>
                <li>
                  <NavLink
                    to="/admin/employees"
                    className={({ isActive }) =>
                      `flex items-center justify-start h-12 px-4 rounded hover:bg-gray-700 transition ${
                        isActive ? "bg-gray-600 text-yellow-300" : "text-white"
                      }`
                    }
                  >
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
                    }
                  >
                    <HiOutlineClipboardList className="mr-2" />
                    Tasks
                  </NavLink>
                </li>
              </>
            ) : (
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `flex items-center justify-start h-12 px-4 rounded hover:bg-gray-700 transition ${
                      isActive ? "bg-gray-600 text-yellow-300" : "text-white"
                    }`
                  }
                >
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
                }
              >
                <MdPassword className="mr-2" />
                Change password
              </NavLink>
            </li>
            <div className="mt-auto">
              <hr />
              <li className="mt-2">
                <NavLink
                  onClick={handleLogout}
                  className="flex items-center justify-start h-12 px-4 rounded hover:bg-gray-700 transition"
                >
                  <AiOutlineLogout className="mr-2" />
                  Logout
                </NavLink>
              </li>
              <li className="text-center mt-5">v0.0.1</li>
            </div>
          </ul>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
