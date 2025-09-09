const Event = require("../models/Event");

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      location,
      startDate,
      endDate,
      ticketTypes,
      tags,
      status,
    } = req.body;

    // Create new event
    const event = new Event({
      title,
      description,
      image,
      location,
      startDate,
      endDate,
      organizer: req.user.id,
      ticketTypes: ticketTypes.map((ticket) => ({
        ...ticket,
        available: ticket.quantity, // Initially, all tickets are available
      })),
      tags,
      status: status || "draft",
    });

    await event.save();

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const { status, search, startDate, endDate, sort } = req.query;
    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    } else {
      // By default, show only published events to regular users
      if (!req.user || req.user.role !== "admin") {
        query.status = "published";
      }
    }

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Filter by date range
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) {
        query.startDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.startDate.$lte = new Date(endDate);
      }
    }

    // Sorting
    let sortOption = { startDate: 1 }; // Default: sort by start date ascending
    if (sort === "dateDesc") {
      sortOption = { startDate: -1 };
    } else if (sort === "titleAsc") {
      sortOption = { title: 1 };
    } else if (sort === "titleDesc") {
      sortOption = { title: -1 };
    }

    const events = await Event.find(query)
      .sort(sortOption)
      .populate("organizer", "name email");

    res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name email"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // If event is not published and user is not admin or organizer
    if (
      event.status !== "published" &&
      (!req.user ||
        (req.user.role !== "admin" &&
          event.organizer._id.toString() !== req.user.id))
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(event);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is admin or event organizer
    if (
      req.user.role !== "admin" &&
      event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      title,
      description,
      image,
      location,
      startDate,
      endDate,
      ticketTypes,
      tags,
      status,
    } = req.body;

    // Update event fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (image) event.image = image;
    if (location) event.location = location;
    if (startDate) event.startDate = startDate;
    if (endDate) event.endDate = endDate;
    if (tags) event.tags = tags;
    if (status) event.status = status;

    // Handle ticket types updates carefully to maintain available counts
    if (ticketTypes) {
      // For each existing ticket type, maintain the correct available count
      event.ticketTypes = ticketTypes.map((newTicket) => {
        // Find corresponding existing ticket type
        const existingTicket = event.ticketTypes.find(
          (t) => t._id && t._id.toString() === newTicket._id
        );

        if (existingTicket) {
          // Calculate difference in quantity
          const quantityDiff = newTicket.quantity - existingTicket.quantity;
          // Update available accordingly
          return {
            ...newTicket,
            available: Math.max(0, existingTicket.available + quantityDiff),
          };
        } else {
          // New ticket type
          return {
            ...newTicket,
            available: newTicket.quantity,
          };
        }
      });
    }

    await event.save();

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is admin or event organizer
    if (
      req.user.role !== "admin" &&
      event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await event.remove();

    res.json({ success: true, message: "Event removed" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get events created by current user
exports.getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(events);
  } catch (error) {
    console.error("Get user events error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
