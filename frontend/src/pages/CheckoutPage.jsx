"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getEventById } from "../api/events";
import {
  createPaymentOrder,
  verifyPayment,
  loadRazorpayScript,
} from "../api/payments";
import { formatPrice } from "../utils/priceFormatter";
import { formatDate } from "../utils/dateFormatter";
import { BeamsBackground } from "../components/ui/beams-background";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  // Get data from location state (passed from EventDetails)
  const { eventId, ticketTypeId, quantity, unitPrice, totalPrice } =
    location.state || {};

  useEffect(() => {
    // Redirect if no ticket data in state
    if (!eventId || !ticketTypeId) {
      navigate("/");
      return;
    }

    // Load Razorpay script
    loadRazorpayScript();

    // Fetch event details
    const fetchEventDetails = async () => {
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);

        // Find selected ticket type
        const selectedTicket = eventData.ticketTypes.find(
          (ticket) => ticket._id === ticketTypeId
        );

        if (!selectedTicket) {
          throw new Error("Selected ticket type not found");
        }

        setTicketData({
          event: eventData,
          ticketType: selectedTicket,
          quantity,
          unitPrice,
          totalPrice,
        });
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load checkout information");
      }
    };

    fetchEventDetails();
  }, [eventId, ticketTypeId, quantity, unitPrice, totalPrice, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK failed to load. Please check your internet connection."
        );
      }

      // Create payment order
      const orderData = await createPaymentOrder({
        eventId,
        ticketTypeId,
        quantity,
        contactInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      });

      // Configure Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "EventTickets",
        description: `${orderData.eventTitle} - ${orderData.ticketTypeName}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResult.success) {
              setPaymentSuccess(true);
              // Navigate to success page after short delay
              setTimeout(() => {
                navigate("/my-tickets", {
                  state: {
                    successMessage:
                      "Your tickets have been booked successfully!",
                    ticketId: verificationResult.ticketId,
                  },
                });
              }, 2000);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            setError("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            setError("Payment was cancelled. Please try again.");
          },
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError(err.message || "Payment initiation failed. Please try again.");
      setIsLoading(false);
    }
  };

  if (!ticketData || !event) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading checkout information...</p>
        </div>
      </div>
    );
  }

  return (
    <BeamsBackground intensity="medium" className="bg-slate-900">
      <div className="py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link
            to={`/events/${eventId}`}
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Event
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            Complete Your Booking
          </h1>

          {paymentSuccess && (
            <div className="bg-green-900/30 border border-green-500 text-green-200 p-6 rounded-lg text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Payment Successful!
              </h2>
              <p>
                Your tickets have been booked. Redirecting to your tickets...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-2">Error</h3>
              <p>{error}</p>
            </div>
          )}

          {!paymentSuccess && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Order Summary
                </h2>

                <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium text-white mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-gray-300 text-sm mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-purple-400"
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
                    <span>{event.location}</span>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-white mb-3">Tickets</h3>
                <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-white font-medium">
                        {ticketData.ticketType.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        Quantity: {quantity}
                      </p>
                    </div>
                    <p className="text-white">{formatPrice(unitPrice)}</p>
                  </div>

                  <div className="border-t border-slate-600 pt-4 flex justify-between items-center">
                    <p className="text-white font-medium">Total</p>
                    <p className="text-lg font-semibold text-white">
                      {formatPrice(totalPrice)}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-900/30 border border-blue-500 text-blue-200 p-4 rounded-lg">
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 mt-0.5 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium mb-1">Secure Payment</p>
                      <p className="text-xs">
                        Your payment is secured by Razorpay. We accept all major
                        cards, UPI, and net banking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Contact Information
                </h2>
                <form className="space-y-4" onSubmit={handlePayment}>
                  <div className="form-group">
                    <label htmlFor="name" className="block text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="block text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="block text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                    <h4 className="text-white font-medium mb-2">
                      Payment Summary
                    </h4>
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>Ticket Price × {quantity}</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>Processing Fee</span>
                      <span>₹0</span>
                    </div>
                    <div className="border-t border-slate-600 pt-2 flex justify-between text-white font-medium">
                      <span>Total Amount</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-md transition-all duration-200 mt-6 flex items-center justify-center font-medium"
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
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Pay {formatPrice(totalPrice)}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-4">
                    By clicking "Pay", you agree to our terms and conditions.
                    Your payment information is secure and encrypted.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </BeamsBackground>
  );
};

export default CheckoutPage;
