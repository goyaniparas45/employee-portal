import { FaUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../services/authService";
const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = getUserData();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 flex items-center justify-between bg-white text-gray-800 p-4 shadow-md">
      <h1 className="text-2xl font-bold tracking-wide">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-4 mr-6">
          <FaUserCircle size={32} />
          <div className="flex flex-col">
            <span className="text-sm">{user.name}</span>
            <span className="text-sm ">{user.email}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow transition duration-300 transform hover:scale-105">
          <IoMdLogOut className="mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
