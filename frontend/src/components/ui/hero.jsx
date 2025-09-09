"use client";
import React from "react";
import { Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Spline = lazy(() => import("@splinetool/react-spline"));

function HeroSplineBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="relative w-full h-full">
        <Spline
          className="w-full h-full object-cover"
          scene="https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode"
        />
        {/* Cover specifically for the "Built with Spline" text in bottom-right corner */}
        <div className="absolute bottom-0 right-0 w-48 h-12 bg-black z-10" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
    </div>
  );
}

function HeroContent() {
  const navigate = useNavigate();

  const handleStartBooking = () => {
    navigate("/events");
  };

  return (
    <div className="relative z-20 text-left text-white pt-16 sm:pt-20 md:pt-24 px-4 max-w-6xl ml-4 sm:ml-8 lg:ml-16">
      <div className="ml-2 sm:ml-6 lg:ml-12">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
          Transform your <br className="hidden sm:block" />
          events into <br className="hidden sm:block" />
          unforgettable experiences.
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 max-w-3xl leading-relaxed">
          Complete event management solution with seamless ticket booking, QR
          code generation, and secure Razorpay payment integration. Create,
          manage, and scale your events effortlessly.
        </p>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <button
            onClick={handleStartBooking}
            className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 w-full sm:w-auto shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Start Booking Events
            <ArrowRight className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hero Section without Navbar
export const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with optimized loading */}
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 animate-pulse" />
          }
        >
          <HeroSplineBackground />
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <HeroContent />
      </div>
    </div>
  );
};
