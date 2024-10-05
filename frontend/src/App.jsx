import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import Login from "./components/Login";
// import Signup from "./components/Signup";
import VerifyCode from "./components/Verify";
import { Navigate } from "react-router-dom";
import ForgotPassword from "./components/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import PropTypes from "prop-types";
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
      }}>
      <div className="max-w-screen-xl h-[600px] overflow-hidden bg-white border rounded-lg flex justify-center flex-1">
        <div className="w-1/2 bg-blue-900 text-center hidden md:flex">
          <div
            className="w-full bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(images/random.jpg)`,
            }}></div>
        </div>
        <div className="w-1/2 max-md:w-full my-auto">{children}</div>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

const AuthRoutes = () => {
  const location = useLocation();
  // "/signup";
  const authRoutes = ["/login", "/verify-code", "/forgot-password"];

  if (authRoutes.includes(location.pathname)) {
    return (
      <AuthLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </AuthLayout>
    );
  }

  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </ProtectedRoute>
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
