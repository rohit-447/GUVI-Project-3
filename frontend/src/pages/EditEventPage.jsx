import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, updateEvent } from "../api/events";
import { BeamsBackground } from "../components/ui/beams-background";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    location: "",
    startDate: "",
    endDate: "",
    ticketTypes: [],
    tags: [],
    status: "draft",
  });

  // Format date for input field using native JavaScript
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await getEventById(id);

        // Format dates for input fields
        const formattedEventData = {
          ...eventData,
          startDate: formatDateForInput(eventData.startDate),
          endDate: formatDateForInput(eventData.endDate),
          tags: eventData.tags || [],
        };

        setFormData(formattedEventData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event data");
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setFormData({
      ...formData,
      tags: tagsArray,
    });
  };

  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...formData.ticketTypes];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]:
        field === "price" || field === "quantity" ? Number(value) : value,
    };

    setFormData({
      ...formData,
      ticketTypes: updatedTickets,
    });
  };

  const addTicketType = () => {
    setFormData({
      ...formData,
      ticketTypes: [
        ...formData.ticketTypes,
        { name: "", description: "", price: 0, quantity: 0, available: 0 },
      ],
    });
  };

  const removeTicketType = (index) => {
    const updatedTickets = [...formData.ticketTypes];
    updatedTickets.splice(index, 1);
    setFormData({
      ...formData,
      ticketTypes: updatedTickets,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      // Prepare data for submission
      const eventData = {
        ...formData,
        // Ensure dates are in ISO format for the API
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      await updateEvent(id, eventData);
      setSubmitting(false);
      navigate(`/events/${id}`);
    } catch (error) {
      console.error("Error updating event:", error);
      setError(error.message || "Failed to update event");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading event data...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="bg-slate-900 min-h-screen py-8 px-4">
        <div className="container mx-auto">
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BeamsBackground intensity="medium" className="bg-slate-900">
      <div className="py-8 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-slate-800 to-slate-800/80 rounded-xl p-6 mb-8 shadow-lg">
            <h1 className="text-2xl font-bold text-white">Edit Event</h1>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 p-6 rounded-lg mb-6">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div className="form-group">
                  <label htmlFor="title" className="block text-gray-400 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
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
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full bg-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="image" className="block text-gray-400 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image || ""}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            </div>

            {/* Date & Location Section */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Date & Location
              </h2>
              <div className="space-y-4">
                <div className="form-group">
                  <label
                    htmlFor="location"
                    className="block text-gray-400 mb-1"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
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
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="endDate"
                      className="block text-gray-400 mb-1"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Types Section */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Ticket Types
              </h2>
              {formData.ticketTypes.map((ticket, index) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Ticket #{index + 1}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="form-group">
                      <label
                        htmlFor={`ticket-name-${index}`}
                        className="block text-gray-400 mb-1"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id={`ticket-name-${index}`}
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
                        htmlFor={`ticket-price-${index}`}
                        className="block text-gray-400 mb-1"
                      >
                        Price ($)
                      </label>
                      <input
                        type="number"
                        id={`ticket-price-${index}`}
                        value={ticket.price}
                        onChange={(e) =>
                          handleTicketChange(index, "price", e.target.value)
                        }
                        min="0"
                        step="0.01"
                        required
                        className="w-full bg-slate-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="form-group">
                      <label
                        htmlFor={`ticket-quantity-${index}`}
                        className="block text-gray-400 mb-1"
                      >
                        Total Quantity
                      </label>
                      <input
                        type="number"
                        id={`ticket-quantity-${index}`}
                        value={ticket.quantity}
                        onChange={(e) =>
                          handleTicketChange(index, "quantity", e.target.value)
                        }
                        min="0"
                        required
                        className="w-full bg-slate-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div className="form-group">
                      <label
                        htmlFor={`ticket-available-${index}`}
                        className="block text-gray-400 mb-1"
                      >
                        Available
                      </label>
                      <input
                        type="number"
                        id={`ticket-available-${index}`}
                        value={ticket.available}
                        onChange={(e) =>
                          handleTicketChange(index, "available", e.target.value)
                        }
                        min="0"
                        max={ticket.quantity}
                        required
                        className="w-full bg-slate-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor={`ticket-description-${index}`}
                      className="block text-gray-400 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id={`ticket-description-${index}`}
                      value={ticket.description || ""}
                      onChange={(e) =>
                        handleTicketChange(index, "description", e.target.value)
                      }
                      className="w-full bg-slate-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTicketType(index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors mt-2"
                  >
                    Remove Ticket Type
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTicketType}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Add Ticket Type
              </button>
            </div>

            {/* Tags & Status Section */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Tags & Status
              </h2>
              <div className="space-y-4">
                <div className="form-group">
                  <label htmlFor="tags" className="block text-gray-400 mb-1">
                    三是 (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={formData.tags.join(", ")}
                    onChange={handleTagsChange}
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
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(`/events/${id}`)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </BeamsBackground>
  );
};

export default EditEventPage;
