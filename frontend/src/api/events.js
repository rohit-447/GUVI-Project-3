import axios from "axios";
import { getToken } from "../utils/tokenManager";

const API_URL = process.env.REACT_APP_API_URL ;

// Helper function to set auth token in headers
const authHeader = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all events with optional filters
export const getAllEvents = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);
    if (filters.sort) queryParams.append("sort", filters.sort);

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";
    const response = await axios.get(
      `${API_URL}/events${queryString}`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch events" };
  }
};

// Get events created by the current user
export const getUserEvents = async () => {
  try {
    // Updated to match the backend route in routes/events.js
    const response = await axios.get(
      `${API_URL}/events/user/myevents`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch your events" };
  }
};

// Get upcoming events
export const getUpcomingEvents = async () => {
  try {
    // Get events with start date >= today, sorted by date ascending
    const today = new Date().toISOString().split("T")[0];
    const response = await axios.get(
      `${API_URL}/events?startDate=${today}&sort=dateAsc`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to fetch upcoming events" }
    );
  }
};

// Get single event by ID
export const getEventById = async (eventId) => {
  try {
    const response = await axios.get(
      `${API_URL}/events/${eventId}`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch event details" };
  }
};

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(
      `${API_URL}/events`,
      eventData,
      authHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create event" };
  }
};

// Update an existing event
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axios.put(
      `${API_URL}/events/${eventId}`,
      eventData,
      authHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update event" };
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/events/${eventId}`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete event" };
  }
};
