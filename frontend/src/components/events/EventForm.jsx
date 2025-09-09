"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../api/events";

const EventForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    image: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    tags: "",
    status: "draft",
    ticketTypes: [
      {
        name: "General Admission",
        description: "Standard ticket",
        price: 0,
        quantity: 100,
      },
    ],
  });

  // Handle changes to the main form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  // Handle changes to ticket types
  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...eventData.ticketTypes];
    updatedTickets[index][field] =
      field === "price" || field === "quantity" ? Number(value) : value;

    setEventData({
      ...eventData,
      ticketTypes: updatedTickets,
    });
  };

  // Add a new ticket type
  const addTicketType = () => {
    setEventData({
      ...eventData,
      ticketTypes: [
        ...eventData.ticketTypes,
        {
          name: "",
          description: "",
          price: 0,
          quantity: 0,
        },
      ],
    });
  };

  // Remove a ticket type
  const removeTicketType = (index) => {
    const updatedTickets = [...eventData.ticketTypes];
    updatedTickets.splice(index, 1);
    setEventData({
      ...eventData,
      ticketTypes: updatedTickets,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Format dates by combining date and time inputs
      const formattedData = {
        ...eventData,
        startDate: `${eventData.startDate}T${eventData.startTime}:00`,
        endDate: `${eventData.endDate}T${eventData.endTime}:00`,
        tags: eventData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      // Remove the time fields as they're now part of the dates
      delete formattedData.startTime;
      delete formattedData.endTime;

      const response = await createEvent(formattedData);
      console.log("Event created successfully:", response);

      // Redirect to the event detail page or events list
      navigate(`/events/${response.event._id}`);
    } catch (err) {
      console.error("Error creating event:", err);
      setError(err.message || "Failed to create event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-slate-800 to-slate-800/80 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white">Create New Event</h2>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-6 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Basic Information
            </h3>
            <div className="space-y-4">
              <div className="form-group">
                <label htmlFor="title" className="block text-gray-400 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="description"
                  className="block text-gray-400 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full bg-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="image" className="block text-gray-400 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={eventData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Date & Location Section */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Date & Location
            </h3>
            <div className="space-y-4">
              <div className="form-group">
                <label htmlFor="location" className="block text-gray-400 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label
                    htmlFor="startDate"
                    className="block text-gray-400 mb-1"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={eventData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="startTime"
                    className="block text-gray-400 mb-1"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={eventData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="endDate" className="block text-gray-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={eventData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endTime" className="block text-gray-400 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={eventData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Types Section */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Ticket Types</h3>
            {eventData.ticketTypes.map((ticket, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-4 mb-4">
                <h4 className="text-lg font-semibold text-white mb-3">
                  Ticket Type {index + 1}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label
                      htmlFor={`ticketName${index}`}
                      className="block text-gray-400 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id={`ticketName${index}`}
                      value={ticket.name}
                      onChange={(e) =>
                        handleTicketChange(index, "name", e.target.value)
                      }
                      required
                      className="w-full bg-slate-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor={`ticketPrice${index}`}
                      className="block text-gray-400 mb-1"
                    >
                      Price ($)
                    </label>
                    <input
                      type="number"
                      id={`ticketPrice${index}`}
                      value={ticket.price}
                      onChange={(e) =>
                        handleTicketChange(index, "price", e.target.value)
                      }
                      required
                      min="0"
                      step="0.01"
                      className="w-full bg-slate-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
                <div className="form-group mb-4">
                  <label
                    htmlFor={`ticketDescription${index}`}
                    className="block text-gray-400 mb-1"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    id={`ticketDescription${index}`}
                    value={ticket.description}
                    onChange={(e) =>
                      handleTicketChange(index, "description", e.target.value)
                    }
                    className="w-full bg-slate-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div className="form-group mb-4">
                  <label
                    htmlFor={`ticketQuantity${index}`}
                    className="block text-gray-400 mb-1"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id={`ticketQuantity${index}`}
                    value={ticket.quantity}
                    onChange={(e) =>
                      handleTicketChange(index, "quantity", e.target.value)
                    }
                    required
                    min="1"
                    className="w-full bg-slate-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                {eventData.ticketTypes.length > 1 && (
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={() => removeTicketType(index)}
                  >
                    Remove Ticket Type
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md transition-colors"
              onClick={addTicketType}
            >
              Add Ticket Type
            </button>
          </div>

          {/* Tags & Status Section */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Tags & Status</h3>
            <div className="space-y-4">
              <div className="form-group">
                <label htmlFor="tags" className="block text-gray-400 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={eventData.tags}
                  onChange={handleChange}
                  placeholder="music, concert, jazz"
                  className="w-full bg-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="form-group">
                <label htmlFor="status" className="block text-gray-400 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={eventData.status}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md transition-colors"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
