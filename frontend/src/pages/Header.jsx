import { FaUserCircle } from "react-icons/fa";
import PropTypes from "prop-types";
import { getUserData } from "../services/authService";
import { AiOutlineMenu } from "react-icons/ai";
const Header = ({ toggleSidebar }) => {
  const user = getUserData();
  return (
    <header className="sticky top-0 flex items-center justify-between bg-white text-gray-800 p-4 shadow-md">
      <button className="md:hidden text-2xl" onClick={toggleSidebar}>
        <AiOutlineMenu />
      </button>

      <h1 className="text-2xl font-bold tracking-wide sm:text-lg">Dashboard</h1>

      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-4 mr-6">
          <FaUserCircle size={32} />

          <div className="hidden sm:flex sm:flex-col text-left">
            <span className="text-sm">{user.name}</span>
            <span className="text-sm">{user.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Header;
