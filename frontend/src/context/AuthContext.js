import React, { createContext, useState, useEffect } from "react";
import { verifyToken } from "../api/auth";
import { setToken, removeToken, setAuthHeader } from "../utils/tokenManager";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Set auth header for axios on initial load
        setAuthHeader(axios);

        const data = await verifyToken();
        if (data) {
          setUser(data);
        }
      } catch (err) {
        console.error("Auth verification error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();

    // Check for Google OAuth callback
    const handleGoogleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token && window.location.pathname.includes("/auth/google/callback")) {
        // Set token
        setToken(token);
        setAuthHeader(axios);

        try {
          // Get user info with the token
          const data = await verifyToken();
          if (data) {
            setUser(data);
            // Clean up URL
            window.history.replaceState({}, document.title, "/");
          }
        } catch (err) {
          console.error("Google auth error:", err);
          setError("Failed to authenticate with Google");
        }
      }
    };

    handleGoogleAuth();
  }, []);

  const loginUser = (userData, token) => {
    setToken(token);
    setAuthHeader(axios);
    setUser(userData);
  };

  const logoutUser = () => {
    removeToken();
    // Clear auth header
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        loginUser,
        logoutUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
