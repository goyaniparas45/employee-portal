import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import Login from "./components/Login";
// import Signup from "./components/Signup";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import VerifyCode from "./components/Verify";
import AdminDashboard from "./pages/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import { getToken } from "./services/authService";

const AuthLayout = ({ children }) => {
  const isAuthenticated = getToken();
  if (isAuthenticated) {
    return <Navigate to="/admin/*" />;
  }
  return (
    <div
      className="h-[100vh] items-center flex justify-center px-5 lg:px-0"
      style={{
        backgroundImage: `url(images/random.jpg)`,
      }}
    >
      <div className="max-w-screen-xl h-[600px] overflow-hidden bg-white border rounded-lg flex justify-center flex-1">
        <div className="w-1/2 bg-blue-900 text-center hidden md:flex">
          <div
            className="w-full bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(images/random.jpg)`,
            }}
          ></div>
        </div>
        <div className="w-1/2 max-md:w-full my-auto">{children}</div>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
const queryParams = new URLSearchParams(location.search);
const token = queryParams.get("token");

const AuthRoutes = () => {
  const location = useLocation();
  const authRoutes = [
    "/login",
    "/verify-code",
    "/forgot-password",
    "/reset-password",
  ];
  if (
    authRoutes.some((route) => location.pathname === route) ||
    (location.pathname === "/reset-password" && token)
  ) {
    return (
      <AuthLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password"
            element={<ResetPassword token={token} />}
          />
        </Routes>
      </AuthLayout>
    );
  }

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminDashboard />} />
      {/* Unauthorized route */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AuthRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
