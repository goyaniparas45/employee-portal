import { useAuth } from "../components/AuthContext";

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard! You are logged in.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
