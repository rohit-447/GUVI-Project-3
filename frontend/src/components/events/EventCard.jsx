import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import { formatPrice } from "../../utils/priceFormatter";

const EventCard = ({ event }) => {
  const lowestPrice =
    event.ticketTypes.length > 0
      ? Math.min(...event.ticketTypes.map((ticket) => ticket.price))
      : 0;

  const totalAvailable = event.ticketTypes.reduce(
    (sum, ticket) => sum + ticket.available,
    0
  );

  const statusColors = {
    published: "bg-green-500",
    draft: "bg-yellow-500",
    cancelled: "bg-red-500",
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] hover:shadow-purple-900/20 h-full">
      <div className="relative h-64 overflow-hidden">
        {event.image ? (
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 to-slate-700 flex items-center justify-center">
            <span className="text-6xl font-bold text-white">
              {event.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full text-white ${
              statusColors[event.status] || "bg-slate-600"
            }`}
          >
            {event.status}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 min-h-[3.5rem]">
          {event.title}
        </h3>

        <div className="flex items-center text-gray-400 text-base mb-3">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formatDate(event.startDate)}</span>
        </div>

        <div className="flex items-center text-gray-400 text-base mb-6">
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">{event.location}</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-white font-semibold text-lg">
            {lowestPrice > 0 ? (
              <span>From {formatPrice(lowestPrice)}</span>
            ) : (
              <span>Free</span>
            )}
          </div>
          <div className="text-base text-gray-400">
            <span>{totalAvailable} tickets</span>
          </div>
        </div>

        <Link
          to={`/events/${event._id}`}
          className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors text-lg font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
