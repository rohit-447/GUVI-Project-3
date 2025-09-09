// In your App.js file, add this to debug
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./Routes";
// import Header from "./components/common/Header";
import { Navbar } from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import "./App.css";

function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  // Add this for debugging
  useEffect(() => {
    console.log("Google Client ID:", googleClientId);
  }, [googleClientId]);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar/>
            <main className="main-content">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
