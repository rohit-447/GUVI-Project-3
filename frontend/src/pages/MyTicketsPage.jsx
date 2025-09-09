"use client";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getUserTickets } from "../api/tickets";
import TicketList from "../components/tickets/TicketList";
import { motion } from "framer-motion";
import { BeamsBackground } from "../components/ui/beams-background";

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || null
  );

  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        setLoading(true);
        const ticketsData = await getUserTickets();
        setTickets(ticketsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load your tickets");
        setLoading(false);
      }
    };

    fetchUserTickets();

    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <BeamsBackground intensity="medium" className="bg-slate-900">
      <motion.div
        className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-gradient-to-r from-slate-800 to-slate-800/80 rounded-xl p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8 shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            My Tickets
          </motion.h1>
          <motion.p
            className="text-gray-400 mt-2 text-sm sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {tickets.length > 0
              ? `You have ${tickets.length} ticket${
                  tickets.length !== 1 ? "s" : ""
                }`
              : "No tickets found"}
          </motion.p>
        </motion.div>

        {successMessage && (
          <motion.div
            className="bg-green-900/30 border border-green-500 text-green-200 p-4 sm:p-6 rounded-lg mb-6 lg:mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <p className="text-sm sm:text-base">{successMessage}</p>
          </motion.div>
        )}

        {loading ? (
          <motion.div
            className="flex justify-center items-center py-12 sm:py-16 lg:py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent"
              ></motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-gray-400 text-sm sm:text-base"
              >
                Loading your tickets...
              </motion.p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            className="bg-red-900/30 border border-red-500 text-red-200 p-4 sm:p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Error</h3>
            <p className="text-sm sm:text-base">{error}</p>
          </motion.div>
        ) : tickets.length === 0 ? (
          <motion.div
            className="bg-slate-800 rounded-xl p-8 sm:p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400"
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
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
              No Tickets Yet
            </h3>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              You haven't purchased any tickets yet. Browse events to get
              started!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href="/events"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition-colors inline-block text-sm sm:text-base"
              >
                Browse Events
              </a>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <TicketList tickets={tickets} />
          </motion.div>
        )}
      </motion.div>
    </BeamsBackground>
  );
};

export default MyTicketsPage;
