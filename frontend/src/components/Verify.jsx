import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdPassword } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { verifyCode } from "../services/authService";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { useAuth } from "./AuthContext";
const VerifyCode = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const { email, type } = location.state || { email: "" };
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type,
    email,
    code: "",
  });
 const [isPasswordVisible, setIsPasswordVisible] =
   useState(false);
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
      const response = await verifyCode(formData);
      const data = response.data;
      showSuccessToast(response.message);
      login(data.token, data.user);
      navigate("/admin/employees");
    } catch (err) {
      console.log(err);
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.code) {
      errors.code = "code is required";
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
              Verify
            </h1>
            <p className="text-[12px] text-gray-500">
              Enter the code you received in your mail
            </p>
          </div>
          <div className="w-full flex-1 mt-8">
            <div className="mx-auto max-w-xs flex flex-col gap-4">
              <div className="relative"> 
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type={isPasswordVisible ? "text" : "password"}
                  name="code"
                  maxLength={6}
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Code"
                  required
                />
                <div
                    className="grid place-content-center absolute z-30 right-4 top-0 bottom-0 cursor-pointer"
                    onClick={() =>
                      setIsPasswordVisible(
                        !isPasswordVisible
                      )
                    }
                  >
                    {!isPasswordVisible ? (
                      <AiFillEyeInvisible />
                    ) : (
                      <AiFillEye />
                    )}
                  </div>
                {error.code && (
                  <span className="text-red-600 text-xs ml-3 mt-1">
                    {error.code}
                  </span>
                )}
              </div>

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
                    Verifying...
                  </div>
                ) : (
                  <span className="ml-3">Sign in</span>
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

export default VerifyCode;
