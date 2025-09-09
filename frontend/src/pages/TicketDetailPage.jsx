"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getTicketById } from "../api/tickets";
import { formatDate } from "../utils/dateFormatter";
import { formatPrice } from "../utils/priceFormatter";
import TicketQRCode from "../components/tickets/TicketQRcode";
import { BeamsBackground } from "../components/ui/beams-background";

const TicketDetailPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        const ticketData = await getTicketById(id);
        setTicket(ticketData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError("Failed to load ticket details");
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  // Animation variants
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const gridItemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  return (
    <BeamsBackground intensity="medium" className="bg-slate-900">
      <div className="container mx-auto max-w-4xl py-4 sm:py-6 lg:py-8 px-4">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 sm:py-20"
            >
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
                Loading ticket details...
              </motion.p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-red-900/30 border border-red-500 text-red-200 p-4 sm:p-6 rounded-lg my-6 sm:my-8"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Error</h3>
              <p className="text-sm sm:text-base">{error}</p>
              <motion.div
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  to="/my-tickets"
                  className="text-purple-400 hover:text-purple-300 transition-colors flex items-center w-fit text-sm sm:text-base"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to My Tickets
                </Link>
              </motion.div>
            </motion.div>
          ) : !ticket ? (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-yellow-900/30 border border-yellow-500 text-yellow-200 p-4 sm:p-6 rounded-lg my-6 sm:my-8"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Not Found
              </h3>
              <p className="text-sm sm:text-base">Ticket not found</p>
              <motion.div
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  to="/my-tickets"
                  className="text-purple-400 hover:text-purple-300 transition-colors flex items-center w-fit text-sm sm:text-base"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to My Tickets
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div
                variants={itemVariants}
                className="mb-4 sm:mb-6"
                whileHover={{ x: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link
                  to="/my-tickets"
                  className="text-purple-400 hover:text-purple-300 transition-colors flex items-center w-fit text-sm sm:text-base"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to My Tickets
                </Link>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700"
              >
                {/* Ticket Status Banner */}
                <motion.div
                  className={`py-2 px-4 text-center ${
                    ticket.isCheckedIn
                      ? "bg-gray-700"
                      : new Date(ticket.event.startDate) < new Date()
                      ? "bg-amber-900/50"
                      : "bg-green-900/50"
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <motion.span
                    className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                  >
                    {ticket.isCheckedIn
                      ? "Ticket Used"
                      : new Date(ticket.event.startDate) < new Date()
                      ? "Expired"
                      : "Valid"}
                  </motion.span>
                </motion.div>

                {/* Ticket Header */}
                <motion.div
                  className="p-4 sm:p-6 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-800/80"
                  variants={itemVariants}
                >
                  <motion.h1
                    className="text-xl sm:text-2xl font-bold text-white mb-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {ticket.event.title}
                  </motion.h1>
                  <motion.p
                    className="text-gray-400 mb-1 text-sm sm:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {formatDate(ticket.event.startDate)} at{" "}
                    {formatDate(ticket.event.startDate)}
                  </motion.p>
                  <motion.p
                    className="text-gray-400 flex items-center text-sm sm:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="truncate">{ticket.event.location}</span>
                  </motion.p>
                </motion.div>

                {/* Ticket Body */}
                <motion.div className="p-4 sm:p-6" variants={itemVariants}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Ticket Information */}
                    <motion.div variants={itemVariants}>
                      <motion.h3
                        className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-purple-400 flex-shrink-0"
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
                        Ticket Information
                      </motion.h3>
                      <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{
                          delayChildren: 0.7,
                          staggerChildren: 0.1,
                        }}
                      >
                        <motion.div
                          className="bg-slate-700/30 p-3 rounded-lg"
                          variants={gridItemVariants}
                          whileHover={{ scale: 1.03 }}
                        >
                          <span className="block text-xs text-gray-400 mb-1">
                            Ticket Type
                          </span>
                          <span className="block text-white font-medium text-sm sm:text-base">
                            {ticket.ticketType}
                          </span>
                        </motion.div>
                        <motion.div
                          className="bg-slate-700/30 p-3 rounded-lg"
                          variants={gridItemVariants}
                          whileHover={{ scale: 1.03 }}
                        >
                          <span className="block text-xs text-gray-400 mb-1">
                            Quantity
                          </span>
                          <span className="block text-white font-medium text-sm sm:text-base">
                            {ticket.quantity}
                          </span>
                        </motion.div>
                        <motion.div
                          className="bg-slate-700/30 p-3 rounded-lg"
                          variants={gridItemVariants}
                          whileHover={{ scale: 1.03 }}
                        >
                          <span className="block text-xs text-gray-400 mb-1">
                            Unit Price
                          </span>
                          <span className="block text-white font-medium text-sm sm:text-base">
                            {formatPrice(ticket.unitPrice)}
                          </span>
                        </motion.div>
                        <motion.div
                          className="bg-slate-700/30 p-3 rounded-lg"
                          variants={gridItemVariants}
                          whileHover={{ scale: 1.03 }}
                        >
                          <span className="block text-xs text-gray-400 mb-1">
                            Total
                          </span>
                          <span className="block text-white font-medium text-sm sm:text-base">
                            {formatPrice(ticket.totalAmount)}
                          </span>
                        </motion.div>
                        <motion.div
                          className="bg-slate-700/30 p-3 rounded-lg"
                          variants={gridItemVariants}
                          whileHover={{ scale: 1.03 }}
                        >
                          <span className="block text-xs text-gray-400 mb-1">
                            Purchase Date
                          </span>
                          <span className="block text-white font-medium text-sm sm:text-base">
                            {formatDate(ticket.purchasedAt)}
                          </span>
                        </motion.div>
                        <motion.div
                          className="bg-slate-700/30 p-3 rounded-lg"
                          variants={gridItemVariants}
                          whileHover={{ scale: 1.03 }}
                        >
                          <span className="block text-xs text-gray-400 mb-1">
                            Ticket Number
                          </span>
                          <span className="block text-white font-medium text-sm sm:text-base truncate">
                            {ticket.ticketNumber}
                          </span>
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* QR Code Section */}
                    <motion.div
                      variants={itemVariants}
                      className="bg-slate-700/20 p-4 rounded-xl flex flex-col items-center"
                    >
                      <motion.h3
                        className="text-base sm:text-lg font-semibold text-white mb-2 flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-purple-400 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                          />
                        </svg>
                        Entry Pass
                      </motion.h3>
                      <motion.p
                        className="text-gray-400 text-xs sm:text-sm mb-4 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                      >
                        Present this QR code at the event entrance
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 1,
                          type: "spring",
                          stiffness: 200,
                        }}
                        className="w-full max-w-[200px] sm:max-w-[250px]"
                      >
                        <TicketQRCode qrData={ticket.qrCode} />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Ticket Footer */}
                <motion.div
                  className="p-4 bg-slate-700/30 text-center"
                  variants={itemVariants}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <p className="text-gray-400 text-xs sm:text-sm">
                    This ticket is subject to the event terms and conditions.
                    Non-refundable.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BeamsBackground>
  );
};

export default TicketDetailPage;
