import { useState } from "react";
import { MdLockReset } from "react-icons/md";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { forgotPassword } from "../services/authService";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
const ForgotPassword = () => {
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setError(newErrors);

    try {
      setLoading(true);
      const resposne = await forgotPassword(formData.email);
      resetForm();
      showSuccessToast(resposne.message);
    } catch (err) {
      showErrorToast(err.message);
    }finally{
      setLoading(false);
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.email) {
      errors.code = "Email is required";
    }

    return errors;
  };

  const resetForm = () => {
    setFormData({
      email: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer />
      <div className="p-6 sm:p-12">
        <div className=" flex flex-col items-center">
          <MdLockReset size={80} className="text-blue-900" />
          <div className="text-center mx-auto">
            <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900 py-1">
              Forgot Password
            </h1>
            <p className="text-[12px] text-gray-500">
              Enter your details to reset the password.
            </p>
          </div>
          <div className="w-full flex-1 mt-8">
            <div className="mx-auto max-w-xs flex flex-col gap-4">
              <div>
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
                {error.email && (
                  <span className="text-red-600 text-xs ml-3 mt-1">
                    {error.email}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="ml-3">
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-gray-100"
                        viewBox="0 0 24 24"
                      >
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
                      Sending Link...
                    </div>
                  ) : (
                    <span className="ml-3">Send Reset Link</span>
                  )}
                </span>
              </button>
              <p className="mt-4 text-xs text-gray-600 text-center">
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

export default ForgotPassword;
