import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, verifyOTP, resendOTP } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";

const RegisterForm = () => {
  const [step, setStep] = useState(1); // 1: Registration Form, 2: OTP Verification
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
  });
  const [otpData, setOtpData] = useState({
    otp: "",
    tempUserId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Only digits, max 6
    setOtpData({
      ...otpData,
      otp: value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setFormError("");
    setSuccessMessage("");

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    console.log("Sending registration data:", userData);

    try {
      const response = await register(userData);
      console.log("Registration response:", response);

      if (response.success && response.tempUserId) {
        setOtpData({
          ...otpData,
          tempUserId: response.tempUserId,
        });
        setStep(2);
        setSuccessMessage("OTP sent to your email! Please check your inbox.");
        startCountdown();
      } else {
        setFormError("Invalid response from server");
      }
    } catch (err) {
      console.error("Registration error details:", err);
      setFormError(err.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    if (otpData.otp.length !== 6) {
      setFormError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setFormError("");

    try {
      const response = await verifyOTP({
        tempUserId: otpData.tempUserId,
        otp: otpData.otp,
      });

      console.log("OTP verification response:", response);

      if (response.success && response.user && response.token) {
        loginUser(response.user, response.token);
        navigate("/dashboard");
      } else {
        setFormError("Invalid response from server");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setFormError(err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const response = await resendOTP(otpData.tempUserId);

      if (response.success) {
        setSuccessMessage("New OTP sent to your email!");
        startCountdown();
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setFormError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Verify Your Email
        </h2>
        <p className="text-gray-300 text-center mb-6">
          We've sent a 6-digit OTP to <strong>{formData.email}</strong>
        </p>

        {formError && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-md mb-6">
            {formError}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-900/30 border border-green-500 text-green-200 p-4 rounded-md mb-6">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleOTPSubmit} className="space-y-6">
          <div className="form-group">
            <label
              htmlFor="otp"
              className="block text-gray-300 mb-2 text-center"
            >
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otpData.otp}
              onChange={handleOTPChange}
              required
              maxLength="6"
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-3 text-white text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors flex items-center justify-center"
            disabled={isLoading || otpData.otp.length !== 6}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 mb-2">Didn't receive the OTP?</p>
          <button
            onClick={handleResendOTP}
            disabled={countdown > 0 || isLoading}
            className={`text-purple-400 hover:text-purple-300 transition-colors ${
              countdown > 0 || isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setStep(1)}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            ← Back to registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Create an Account
      </h2>

      {formError && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-md mb-6">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="name" className="block text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="block text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="block text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role" className="block text-gray-300 mb-2">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="organizer">Organizer</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending OTP...
            </>
          ) : (
            "Send OTP"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
