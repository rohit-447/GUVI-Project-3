"use client";
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";
import { BeamsBackground } from "../components/ui/beams-background";

const LoginPage = () => {
  return (
    <BeamsBackground intensity="medium" className="bg-slate-900">
      <div className="flex items-center justify-center px-4 py-12">
        <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-violet-400 bg-clip-text text-transparent">
                EventBooker
              </h1>
            </Link>
            <p className="text-gray-400 mt-2">Sign in to your account</p>
          </div>

          <LoginForm />

          <div className="mt-6 relative flex items-center justify-center">
            <div className="border-t border-slate-700 absolute w-full"></div>
            <div className="bg-slate-800 px-4 relative z-10 text-gray-400 text-sm">
              OR
            </div>
          </div>

          <div className="mt-6">
            <GoogleAuthButton />
          </div>
        </div>
      </div>
    </BeamsBackground>
  );
};

export default LoginPage;
