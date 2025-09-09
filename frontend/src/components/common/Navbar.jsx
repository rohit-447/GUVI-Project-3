"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function Navbar() {
  const { user, logoutUser } = useAuth();
  const isAdmin = user && user.role === "admin";
  const [hoveredNavItem, setHoveredNavItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedMobileDropdown, setExpandedMobileDropdown] = useState(null);

  const handleScroll = useCallback(() => {
    const isScrolled = window.scrollY > 50;
    setScrolled(isScrolled);
  }, []);

  useEffect(() => {
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setExpandedMobileDropdown(null);
    document.body.style.overflow = "unset";
  };

  const handleLogout = () => {
    logoutUser();
    closeMobileMenu();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);

    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setExpandedMobileDropdown(null);
    }
  };

  const toggleMobileDropdown = (item) => {
    setExpandedMobileDropdown(expandedMobileDropdown === item ? null : item);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest("nav")) {
        setIsMobileMenuOpen(false);
        setExpandedMobileDropdown(null);
        document.body.style.overflow = "unset";
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        setExpandedMobileDropdown(null);
        document.body.style.overflow = "unset";
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinkClass = (itemName, extraClasses = "") => {
    const isCurrentItemHovered = hoveredNavItem === itemName;
    const isAnotherItemHovered =
      hoveredNavItem !== null && !isCurrentItemHovered;
    const colorClass = isCurrentItemHovered
      ? "text-white"
      : isAnotherItemHovered
      ? "text-gray-500"
      : "text-gray-200";

    return `text-sm font-medium transition-all duration-200 ${colorClass} ${extraClasses}`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          : "bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-3 md:py-4 lg:px-8">
        <div className="flex items-center justify-between h-12 md:h-14">
          {/* Logo */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <Link to="/" className="flex items-center space-x-2 md:space-x-3">
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg md:text-xl">
                    E
                  </span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30"></div>
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                EventBooker
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <Link
                to="/events"
                className={navLinkClass("events", "hover:text-white")}
              >
                Events
              </Link>
            </div>

            {/* Public navigation items (when not logged in) */}
            {!user && (
              <>
                {["Features", "Solutions"].map((item) => (
                  <div
                    key={item}
                    className="relative group"
                    onMouseEnter={() => setHoveredNavItem(item.toLowerCase())}
                    onMouseLeave={() => setHoveredNavItem(null)}
                  >
                    <a
                      href="#"
                      className={navLinkClass(
                        item.toLowerCase(),
                        "flex items-center hover:text-white"
                      )}
                    >
                      {item}
                      {item !== "Pricing" && (
                        <svg
                          className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </a>
                    {item !== "Pricing" && (
                      <div className="absolute left-0 mt-3 w-56 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl py-3 border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                        {item === "Features" && (
                          <>
                            <DropdownItem href="#" text="Event Creation" />
                            <DropdownItem href="#" text="Ticket Booking" />
                            <DropdownItem href="#" text="QR Code System" />
                            <DropdownItem href="#" text="Payment Integration" />
                          </>
                        )}
                        {item === "Solutions" && (
                          <>
                            <DropdownItem href="#" text="Corporate Events" />
                            <DropdownItem href="#" text="Conferences" />
                            <DropdownItem href="#" text="Workshops" />
                          </>
                        )}
                        {item === "Resources" && (
                          <>
                            <DropdownItem href="#" text="Documentation" />
                            <DropdownItem href="#" text="API Reference" />
                            <DropdownItem href="#" text="Support" />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {user && (
              <>
                <div className="relative group">
                  <Link
                    to="/"
                    className={navLinkClass("dashboard", "hover:text-white")}
                  >
                    Dashboard
                  </Link>
                </div>

                {isAdmin && (
                  <div className="relative group">
                    <Link
                      to="/create-event"
                      className={navLinkClass(
                        "create-event",
                        "hover:text-white"
                      )}
                    >
                      Create Event
                    </Link>
                  </div>
                )}

                <div className="relative group">
                  <Link
                    to="/my-tickets"
                    className={navLinkClass("my-tickets", "hover:text-white")}
                  >
                    My Tickets
                  </Link>
                </div>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center text-gray-200 hover:text-white transition-all duration-200 text-sm font-medium">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-sm font-semibold">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="max-w-24 truncate">
                      {user.name || user.email}
                    </span>
                    <svg
                      className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* User Dropdown */}
                  <div className="absolute right-0 mt-3 w-56 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl py-3 border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-150 rounded-lg mx-2"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-150 rounded-lg mx-2"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          {!user && (
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link
                to="/login"
                className="hidden md:block text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              {/* Hide Join button on mobile, show on md and above */}
              <Link
                to="/register"
                className="hidden md:block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-full text-xs md:text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </Link>

              {/* Mobile menu button */}
              <button
                className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors ml-2"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Mobile menu button for authenticated users */}
          {user && (
            <div className="flex items-center space-x-3">
              {/* User avatar for mobile - smaller */}
              <div className="lg:hidden flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 transform ${
            isMobileMenuOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-4"
          }`}
        >
          <div className="px-4 py-4 md:py-6 space-y-3 md:space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
            {/* Always show Events */}
            <Link
              to="/events"
              className="block text-gray-200 hover:text-white text-base md:text-lg font-medium py-2 md:py-3 px-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              onClick={closeMobileMenu}
            >
              Events
            </Link>

            {/* Public navigation for non-authenticated users */}
            {!user && (
              <>
                {["Features", "Solutions"].map((item) => (
                  <div key={item} className="space-y-2">
                    <button
                      className="flex items-center justify-between w-full text-left text-gray-200 hover:text-white text-base md:text-lg font-medium py-2 md:py-3 px-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                      onClick={() => toggleMobileDropdown(item.toLowerCase())}
                    >
                      {item}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedMobileDropdown === item.toLowerCase()
                            ? "rotate-180"
                            : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Mobile dropdown content */}
                    <div
                      className={`ml-4 space-y-2 overflow-hidden transition-all duration-200 ${
                        expandedMobileDropdown === item.toLowerCase()
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {item === "Features" && (
                        <>
                          <MobileDropdownItem
                            text="Event Creation"
                            onClick={closeMobileMenu}
                          />
                          <MobileDropdownItem
                            text="Ticket Booking"
                            onClick={closeMobileMenu}
                          />
                          <MobileDropdownItem
                            text="QR Code System"
                            onClick={closeMobileMenu}
                          />
                          <MobileDropdownItem
                            text="Payment Integration"
                            onClick={closeMobileMenu}
                          />
                        </>
                      )}
                      {item === "Solutions" && (
                        <>
                          <MobileDropdownItem
                            text="Corporate Events"
                            onClick={closeMobileMenu}
                          />
                          <MobileDropdownItem
                            text="Conferences"
                            onClick={closeMobileMenu}
                          />
                          <MobileDropdownItem
                            text="Workshops"
                            onClick={closeMobileMenu}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {["Resources", "Pricing"].map((item) => (
                  <button
                    key={item}
                    className="block w-full text-left text-gray-200 hover:text-white text-base md:text-lg font-medium py-2 md:py-3 px-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    {item}
                  </button>
                ))}

                <div className="pt-3 md:pt-4 border-t border-white/10 space-y-3 md:space-y-4">
                  <button
                    className="block w-full text-left text-gray-200 hover:text-white text-base md:text-lg font-medium py-2 md:py-3 px-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    Contact Sales
                  </button>
                  <Link
                    to="/login"
                    className="block text-gray-200 hover:text-white text-base md:text-lg font-medium py-2 md:py-3 px-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 md:py-4 px-4 rounded-xl text-center text-base md:text-lg transition-all duration-200 shadow-lg"
                    onClick={closeMobileMenu}
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}

            {/* Authenticated user navigation */}
            {user && (
              <>
                <Link
                  to="/"
                  className="block text-gray-200 hover:text-white text-base md:text-lg font-medium py-2 md:py-3 px-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>

                {isAdmin && (
                  <Link
                    to="/create-event"
                    className="block text-gray-200 hover:text-white text-base md:text-lg font-medium py-2 md:py-3 px-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    Create Event
                  </Link>
                )}

                <Link
                  to="/my-tickets"
                  className="block text-gray-200 hover:text-white text-base md:text-lg font-medium py-2 md:py-3 px-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  My Tickets
                </Link>

                {/* User section in mobile */}
                <div className="pt-3 md:pt-4 border-t border-white/10 space-y-3 md:space-y-4">
                  <div className="flex items-center space-x-3 py-2 md:py-3 px-2 bg-white/5 rounded-lg">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm md:text-base font-semibold">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate text-base md:text-lg">
                        {user.name || user.email}
                      </p>
                      <p className="text-gray-400 text-sm md:text-base">
                        {user.role === "admin" ? "Administrator" : "User"}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    className="block text-gray-200 hover:text-white text-base md:text-lg font-medium py-2 md:py-3 px-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    My Account
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-red-400 hover:text-red-300 text-base md:text-lg font-medium py-2 md:py-3 px-2 rounded-lg hover:bg-red-500/10 transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Helper component for dropdown items
function DropdownItem({ href, text }) {
  return (
    <a
      href={href}
      className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-150 rounded-lg mx-2"
    >
      {text}
    </a>
  );
}

function MobileDropdownItem({ text, onClick }) {
  return (
    <button
      className="block w-full text-left text-gray-300 hover:text-white text-sm md:text-base py-2 px-3 rounded-lg hover:bg-white/5 transition-all duration-150"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
