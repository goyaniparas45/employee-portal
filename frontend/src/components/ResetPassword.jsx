import { MdPassword } from "react-icons/md";
import { useState } from "react";
import { resetPassword } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import { ToastContainer } from "react-toastify";
const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const [formData, setFormData] = useState({
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
      console.log("Form submission failed due to validation errors.");
      return;
    }
    setLoading(true);
    try {
      const body = { newPassword: formData.password, token };
      const response = await resetPassword(body);
      showSuccessToast(response.message);
      navigate("/login");
    } catch (err) {
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (data) => {
    const errors = {};

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!passwordRegex.test(data.password)) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords  and Cofirm Password does not match";
    }

    return errors;
  };

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer />
      <div className="p-6 sm:p-12">
        <div className="flex flex-col items-center">
          <MdPassword size={50} className="text-blue-900" />
          <div className="text-center">
            <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900 py-1">
              Reset Password
            </h1>
            <p className="text-[12px] text-gray-500">Enter the new password</p>
          </div>
          <div className="w-full flex-1 mt-8">
            <div className="mx-auto max-w-xs flex flex-col gap-4">
              <div>
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white "
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                {error.password && (
                  <span className="text-red-600 text-xs  mt-1">
                    {error.password}
                  </span>
                )}
                <input
                  className="mt-4 w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
                {error.confirmPassword && (
                  <span className="text-red-600 text-xs  mt-1">
                    {error.confirmPassword}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                {loading ? (
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
                    Password Resetting...
                  </div>
                ) : (
                  <span className="ml-3">Reset</span>
                )}
              </button>

              <p className="mt-6 text-xs text-gray-600 text-center">
                Back to{" "}
                <Link to="/login">
                  <span className="text-blue-900 font-semibold">Sign in</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ResetPassword;
