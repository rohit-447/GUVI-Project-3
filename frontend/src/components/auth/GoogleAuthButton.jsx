import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const GoogleAuthButton = () => {
  const { loginUser, setError } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setLocalError("");
      console.log("Google login success, credential received");

      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      // Call the backend to verify and process the Google credential
      const response = await googleLogin(credentialResponse.credential);

      if (!response || !response.user || !response.token) {
        throw new Error("Invalid response from server");
      }

      // Update the authentication context
      loginUser(response.user, response.token);

      // Redirect to dashboard
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage =
        error.message || "Failed to authenticate with Google";
      setLocalError(errorMessage);

      if (setError) {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error) => {
    console.error("Google login failed:", error);
    setLocalError("Google authentication failed. Please try again.");
    if (setError) {
      setError("Google authentication failed. Please try again.");
    }
  };

  return (
    <div className="w-full">
      {localError && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 p-3 rounded-md mb-4 text-sm">
          {localError}
        </div>
      )}

      {isLoading ? (
        <div className="w-full bg-slate-700 text-white py-3 rounded-md flex items-center justify-center">
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
          Authenticating with Google...
        </div>
      ) : (
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={false}
            theme="filled_black"
            size="large"
            text="continue_with"
            shape="rectangular"
            width={280}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      )}
    </div>
  );
};

export default GoogleAuthButton;
