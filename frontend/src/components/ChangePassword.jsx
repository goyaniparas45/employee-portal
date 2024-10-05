import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdPassword } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import { changePassword } from "../services/authService";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";

const ChangePassword = () => {
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isConfirmNewPasswordVisible, setIsConfirmNewPasswordVisible] =
    useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const response = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      showSuccessToast(response.message);
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

    if (!data.newPassword) {
      errors.newPassword = "Password is required";
    } else if (data.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters long";
    } else if (!passwordRegex.test(data.newPassword)) {
      errors.newPassword =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!data.confirmNewPassword) {
      errors.confirmNewPassword = "Please confirm your password";
    } else if (data.newPassword !== data.confirmNewPassword) {
      errors.confirmNewPassword =
        "Passwords  and Cofirm Password does not match";
    }

    return errors;
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white h-full">
      <ToastContainer />
      <div className="p-6 sm:p-12 ">
        <div className="flex flex-col items-center  ">
          <MdPassword size={50} className="text-blue-900" />
          <div className="text-center">
            <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900 py-1">
              Change Password
            </h1>
          </div>
          <div className="w-full flex-1 mt-8">
            <div className="mx-auto max-w-xs flex flex-col gap-4">
              <div>
                <div className="relative">
                  <input
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white "
                    type={isCurrentPasswordVisible ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Current Password"
                    required
                  />
                  <div
                    className="grid place-content-center absolute z-30 right-4 top-0 bottom-0 cursor-pointer"
                    onClick={() =>
                      setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
                    }
                  >
                    {!isCurrentPasswordVisible ? (
                      <AiFillEyeInvisible />
                    ) : (
                      <AiFillEye />
                    )}
                  </div>
                </div>
                <input
                  className="mt-4 w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white "
                  type="text"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                  required
                />
                {error.newPassword && (
                  <span className="text-red-600 text-xs  mt-1">
                    {error.newPassword}
                  </span>
                )}
                <div className="relative mt-4 ">
                  <input
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type={isConfirmNewPasswordVisible ? "text" : "password"}
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                  />
                  {error.confirmNewPassword && (
                    <span className="text-red-600 text-xs  mt-1">
                      {error.confirmNewPassword}
                    </span>
                  )}
                  <div
                    className="grid place-content-center absolute z-30 right-4 top-0 bottom-0 cursor-pointer"
                    onClick={() =>
                      setIsConfirmNewPasswordVisible(
                        !isConfirmNewPasswordVisible
                      )
                    }
                  >
                    {!isConfirmNewPasswordVisible ? (
                      <AiFillEyeInvisible />
                    ) : (
                      <AiFillEye />
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
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
                    Changing Password...
                  </div>
                ) : (
                  <span className="ml-3">Change password</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChangePassword;
