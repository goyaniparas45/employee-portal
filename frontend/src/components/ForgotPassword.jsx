import { useState } from "react";
import { forgotPassword } from "../services/authService";
import { MdLockReset } from "react-icons/md";
import { Link } from "react-router-dom";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError(""); // Reset error message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!email) {
      setError("Email is required.");
      return;
    }

    try {
      await forgotPassword(email);
      setSuccess("A reset link has been sent to your email.");
    } catch (err) {
      console.error(err);
      setError("Failed to send reset link, please try again.");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
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
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />

                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                {success && (
                  <p className="text-green-600 text-sm mb-4">{success}</p>
                )}
              </div>

              <button
                type="submit"
                className="tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                <span className="ml-3">Send Reset Link</span>
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
