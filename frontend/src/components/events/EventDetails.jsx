import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEventById } from "../../api/events";
import { useAuth } from "../../hooks/useAuth";
import { formatDateRange } from "../../utils/dateFormatter";
import { formatPrice } from "../../utils/priceFormatter";

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const eventData = await getEventById(id);
        setEvent(eventData);

        // Set first ticket type as default selected
        if (eventData.ticketTypes && eventData.ticketTypes.length > 0) {
          setSelectedTicket(eventData.ticketTypes[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details");
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setQuantity(1); // Reset quantity when changing ticket type
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (selectedTicket?.available || 0)) {
      setQuantity(value);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { redirectTo: `/events/${id}` } });
      return;
    }

    navigate("/checkout", {
      state: {
        eventId: id,
        ticketTypeId: selectedTicket._id,
        quantity: quantity,
        unitPrice: selectedTicket.price,
        totalPrice: selectedTicket.price * quantity,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 min-h-screen py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-slate-900 min-h-screen py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-slate-800 rounded-xl shadow-lg p-6 text-white text-center">
            <h3 className="text-xl font-semibold">Event not found</h3>
          </div>
        </div>
      </div>
    );
  }

  const isOrganizer =
    user && event.organizer && user.id === event.organizer._id;
  const isEventPast = new Date(event.endDate) < new Date();
  const isEventCancelled = event.status === "cancelled";
  const canPurchaseTickets =
    !isEventPast && !isEventCancelled && event.status === "published";

  return (
    <div className="bg-slate-900 min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link
          to="/events"
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
          Back to Events
        </Link>

        <div className="bg-slate-800 rounded-xl shadow-lg p-6">
          {/* Event Status Banner */}
          <div className="mb-6">
            {isEventPast && (
              <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg text-center">
                Event has ended
              </div>
            )}
            {isEventCancelled && (
              <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg text-center">
                Event cancelled
              </div>
            )}
            {event.status === "draft" && (
              <div className="bg-yellow-900/30 border border-yellow-500 text-yellow-200 p-4 rounded-lg text-center">
                Draft
              </div>
            )}
          </div>

          {/* Organizer Actions */}
          {isOrganizer && (
            <div className="flex justify-end mb-6">
              <Link
                to={`/edit-event/${event._id}`}
                className="bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white py-2 px-4 rounded-md transition-colors"
              >
                Edit Event
              </Link>
            </div>
          )}

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              {/* Event Image */}
              <div className="mb-6">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-slate-700 rounded-lg flex items-center justify-center">
                    <span className="text-4xl text-gray-400">
                      {event.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Event Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {event.title}
              </h1>

              {/* Event Meta */}
              <div className="space-y-2 mb-6">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{formatDateRange(event.startDate, event.endDate)}</span>
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>
                    Organized by{" "}
                    {event.organizer ? event.organizer.name : "Unknown"}
                  </span>
                </div>
              </div>

              {/* Event Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {event.tags &&
                  event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-slate-700 text-gray-200 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
              </div>

              {/* Event Description */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  About this event
                </h2>
                <div className="text-gray-300">
                  {event.description.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-2">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1 space-y-6">
              {/* Ticket Selection Card */}
              <div className="bg-slate-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Tickets
                </h2>

                {event.ticketTypes.length === 0 ? (
                  <div className="text-gray-400">
                    No tickets available for this event.
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {event.ticketTypes.map((ticket) => (
                        <div
                          key={ticket._id}
                          className={`bg-slate-700/50 rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedTicket?._id === ticket._id
                              ? "border border-purple-500"
                              : ""
                          } ${ticket.available === 0 ? "opacity-50" : ""}`}
                          onClick={() =>
                            ticket.available > 0 && handleTicketSelect(ticket)
                          }
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-white font-medium">
                                {ticket.name}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {formatPrice(ticket.price)}
                              </p>
                              {ticket.description && (
                                <p className="text-gray-400 text-sm mt-1">
                                  {ticket.description}
                                </p>
                              )}
                            </div>
                            <div className="text-sm">
                              {ticket.available > 0 ? (
                                <span className="text-green-400">
                                  {ticket.available} available
                                </span>
                              ) : (
                                <span className="text-red-400">Sold out</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedTicket && (
                      <div className="space-y-4">
                        <div className="quantity-selector">
                          <label
                            htmlFor="quantity"
                            className="block text-gray-300 mb-2"
                          >
                            Quantity
                          </label>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              className="bg-slate-700 text-white px-3 py-1 rounded-md hover:bg-slate-600 disabled:opacity-50"
                              disabled={quantity <= 1}
                              onClick={() =>
                                quantity > 1 && setQuantity(quantity - 1)
                              }
                            >
                              -
                            </button>
                            <input
                              id="quantity"
                              type="number"
                              min="1"
                              max={selectedTicket.available}
                              value={quantity}
                              onChange={handleQuantityChange}
                              className="w-16 bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                              type="button"
                              className="bg-slate-700 text-white px-3 py-1 rounded-md hover:bg-slate-600 disabled:opacity-50"
                              disabled={quantity >= selectedTicket.available}
                              onClick={() =>
                                quantity < selectedTicket.available &&
                                setQuantity(quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="bg-slate-700/50 rounded-lg p-4">
                          <div className="flex justify-between text-gray-300 text-sm mb-2">
                            <span>Price per ticket</span>
                            <span>{formatPrice(selectedTicket.price)}</span>
                          </div>
                          <div className="flex justify-between text-gray-300 text-sm mb-2">
                            <span>Quantity</span>
                            <span>{quantity}</span>
                          </div>
                          <div className="flex justify-between text-white font-semibold">
                            <span>Total</span>
                            <span>
                              {formatPrice(selectedTicket.price * quantity)}
                            </span>
                          </div>
                        </div>

                        <button
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors disabled:opacity-50"
                          disabled={
                            !canPurchaseTickets ||
                            selectedTicket.available === 0
                          }
                          onClick={handleCheckout}
                        >
                          {canPurchaseTickets
                            ? "Get Tickets"
                            : "Tickets Unavailable"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Location Card */}
              <div className="bg-slate-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Location
                </h2>
                <p className="text-gray-300">{event.location}</p>
                {/* Optional: Add a map component here */}
              </div>

              {/* Share Event Card */}
              <div className="bg-slate-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Share Event
                </h2>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors">
                    Facebook
                  </button>
                  <button className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-md transition-colors">
                    Twitter
                  </button>
                  <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md transition-colors">
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
