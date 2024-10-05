import { useState } from "react";
import { login } from "../services/authService";
import { Link } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import { ToastContainer } from "react-toastify";
import { PiSignIn } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setLoading(true);
    try {
      const response = await login(formData);
      showSuccessToast(response.message);
      navigate("/verify-code", {
        state: { email: formData.email, type: "login" },
      });
    } catch (err) {
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.email.trim()) {
      errors.email = "email is required";
    } else if (data.email.length < 4) {
      errors.email = "Name must be at least 4 characters long";
    }

    if (!data.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer />
      <div className="p-6 sm:p-12">
        <div className=" flex flex-col items-center">
          <PiSignIn size={50} className="text-blue-900" />
          <div className="text-center">
            <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900 py-1">
              Sign in
            </h1>
            <p className="text-[12px] text-gray-500">
              Enter your details to access your account
            </p>
          </div>
          <div className="w-full flex-1 mt-8">
            <div className="mx-auto max-w-xs flex flex-col gap-4">
              <div>
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 lowercase text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
                {error.email && (
                  <span className="text-red-600 text-xs mt-4  ml-3">
                    {error.email}
                  </span>
                )}
              </div>
              <div>
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                {error.password && (
                  <span className="text-red-600 text-xs mt-4  ml-3">
                    {error.password}
                  </span>
                )}
              </div>
              <button className="w-full text-right">
                <Link to="/forgot-password">
                  <span className="text-blue-900 font-normal text-sm">
                    Forgot Password?
                  </span>
                </Link>
              </button>
              <button
                type="submit"
                disabled={loading} // Disable button when loading
                className={`tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                {loading ? ( // Show loader or text
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-gray-100"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12c0-1.104.896-2 2-2h12c1.104 0 2 .896 2 2s-.896 2-2 2H6c-1.104 0-2-.896-2-2z"
                      />
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <span className="ml-3">Sign in</span>
                )}
              </button>
              {/* <button
                type="submit"
                className="tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                <span className="ml-3">Sign in</span>
              </button> */}
              {/* <p className="mt-6 text-xs text-gray-600 text-center">
                Don&apos;t have an account?{" "}
                <Link to="/signup">
                  <span className="text-blue-900 font-semibold">Sign up</span>
                </Link>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
