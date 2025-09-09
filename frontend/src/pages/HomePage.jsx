"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const HomePage = () => {
  const { user } = useAuth()

  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="hero-section bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-24 px-8 text-center">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
              EventBooker
            </span>
          </h1>
          <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
            Discover, create, and attend amazing events with our powerful event management platform
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-md text-xl font-medium transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-md text-xl font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-transparent hover:bg-white/10 text-white border border-white/30 px-10 py-4 rounded-md text-xl font-medium transition-colors"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="features-section py-20 px-8">
        <div className="w-full">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
              
            </span>
            ?
          </h2>

          <div className="grid grid-cols-3 gap-12">
            <div className="bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-purple-900/20 transition-all hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mb-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Discover Events</h3>
              <p className="text-gray-400 text-lg">
                Find events that match your interests and preferences with our powerful search and recommendation
                system.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-purple-900/20 transition-all hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mb-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Create & Manage</h3>
              <p className="text-gray-400 text-lg">
                Easily create and manage your own events with our intuitive tools and comprehensive dashboard.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-purple-900/20 transition-all hover:translate-y-[-5px]">
              <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mb-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Secure Tickets</h3>
              <p className="text-gray-400 text-lg">
                Purchase and store tickets securely with our state-of-the-art ticketing system and mobile access.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section bg-gradient-to-br from-purple-900/30 to-slate-900 py-20 px-8">
        <div className="w-full text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to Get Started?</h2>
          <p className="text-2xl text-gray-300 mb-10">
            Join thousands of event organizers and attendees on our platform today.
          </p>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-md text-xl font-medium transition-colors"
          >
            {user ? "Go to Dashboard" : "Create Free Account"}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
