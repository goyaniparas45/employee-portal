import { FaUserCircle } from "react-icons/fa";

import { getUserData } from "../services/authService";
const Header = () => {
  const user = getUserData();

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
      </div>
    </header>
  );
};

export default Header;
