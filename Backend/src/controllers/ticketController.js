const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const User = require("../models/User");
const crypto = require("crypto");
const { generateTicketQR, verifyQRCode } = require("../utils/qrCodeGenerator");
const { sendTicketEmail, testEmailConfig } = require("../utils/emailService");

// Debug endpoint to test email configuration
exports.testEmail = async (req, res) => {
  try {
    console.log("=== TESTING EMAIL CONFIGURATION ===");

    const testResult = await testEmailConfig();
    console.log("Email config test result:", testResult);

    if (testResult.success) {
      // Try sending a test email to the user
      const testEmail = await require("../utils/emailService").sendTestEmail(
        req.user.email || req.body.email
      );
      console.log("Test email result:", testEmail);

      res.json({
        message: "Email test completed",
        configTest: testResult,
        emailTest: testEmail,
      });
    } else {
      res.status(500).json({
        message: "Email configuration failed",
        error: testResult.error,
      });
    }
  } catch (error) {
    console.error("Email test error:", error);
    res.status(500).json({
      message: "Email test failed",
      error: error.message,
    });
  }
};

// Get user's tickets
exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id })
      .populate({
        path: "event",
        select: "title startDate location image",
      })
      .sort({ purchasedAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error("Get user tickets error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single ticket
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate({
        path: "event",
        select: "title description startDate endDate location image organizer",
      })
      .populate({
        path: "user",
        select: "name email",
      });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if user is ticket owner, admin, or event organizer
    if (
      ticket.user._id.toString() !== req.user.id &&
      req.user.role !== "admin" &&
      ticket.event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Get ticket error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create ticket endpoint (no payment required)
exports.createTicket = async (req, res) => {
  console.log("=== STARTING TICKET CREATION ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  console.log("User ID:", req.user.id);
  console.log("User email:", req.user.email);

  try {
    const { eventId, ticketTypeId, quantity, contactInfo } = req.body;
    const userId = req.user.id;

    console.log("Extracted data:");
    console.log("- Event ID:", eventId);
    console.log("- Ticket Type ID:", ticketTypeId);
    console.log("- Quantity:", quantity);
    console.log("- Contact Info:", contactInfo);

    // Validate required fields
    if (!eventId || !ticketTypeId || !quantity) {
      console.log("✗ Missing required fields");
      return res.status(400).json({
        message: "Missing required fields: eventId, ticketTypeId, quantity",
      });
    }

    // Get event details
    console.log("Fetching event details...");
    const event = await Event.findById(eventId);
    if (!event) {
      console.log("✗ Event not found");
      return res.status(404).json({ message: "Event not found" });
    }
    console.log("✓ Event found:", event.title);

    // Find ticket type
    console.log("Finding ticket type...");
    const ticketType = event.ticketTypes.id(ticketTypeId);
    if (!ticketType) {
      console.log("✗ Ticket type not found");
      return res.status(404).json({ message: "Ticket type not found" });
    }
    console.log("✓ Ticket type found:", ticketType.name);

    // Check availability
    console.log("Checking availability...");
    console.log("Available:", ticketType.available, "Requested:", quantity);
    if (ticketType.available < quantity) {
      console.log("✗ Not enough tickets available");
      return res.status(400).json({ message: "Not enough tickets available" });
    }
    console.log("✓ Tickets available");

    // Create ticket
    console.log("Creating ticket...");
    const ticket = new Ticket({
      event: eventId,
      user: userId,
      ticketType: ticketType.name,
      quantity,
      unitPrice: ticketType.price,
      totalAmount: ticketType.price * quantity,
      paymentId: "free-booking-" + Date.now(),
      paymentStatus: "completed",
    });

    // Generate QR code
    console.log("Generating QR code...");
    let qrCode;
    try {
      qrCode = await generateTicketQR(ticket);
      ticket.qrCode = qrCode;
      console.log("✓ QR code generated");
    } catch (qrError) {
      console.log("⚠ QR code generation failed:", qrError.message);
      // Continue without QR code - don't fail the entire process
    }

    // Save ticket
    console.log("Saving ticket...");
    await ticket.save();
    console.log("✓ Ticket saved with ID:", ticket._id);

    // Update ticket availability
    console.log("Updating ticket availability...");
    ticketType.available -= quantity;
    await event.save();
    console.log("✓ Availability updated");

    // Get user details for email
    console.log("Fetching user details...");
    const user = await User.findById(userId);
    if (!user) {
      console.log("✗ User not found");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("✓ User found:", user.name, user.email);

    // Prepare email recipient
    const emailRecipient = {
      name: contactInfo?.name || user.name,
      email: contactInfo?.email || user.email,
      phone: contactInfo?.phone || user.phone || "Not provided",
    };

    console.log("Email recipient:", emailRecipient);

    // Send confirmation email
    console.log("Attempting to send confirmation email...");
    let emailResult = { success: false, error: "Not attempted" };

    try {
      emailResult = await sendTicketEmail(
        emailRecipient,
        ticket,
        event,
        qrCode
      );
      console.log("Email send result:", emailResult);

      if (emailResult.success) {
        console.log("✓ Email sent successfully to:", emailRecipient.email);
      } else {
        console.log("✗ Email sending failed:", emailResult.error);
      }
    } catch (emailError) {
      console.error("Email sending exception:", emailError);
      emailResult = { success: false, error: emailError.message };
    }

    console.log("=== TICKET CREATION COMPLETE ===");

    // Respond with success
    res.status(201).json({
      message: "Ticket created successfully",
      ticket: {
        ...ticket.toObject(), // Convert to plain object
        ticketNumber: ticket.ticketNumber, // Ensure ticket number is included
      },
      emailSent: emailResult.success,
      emailError: emailResult.success ? null : emailResult.error,
    });
  } catch (error) {
    console.error("=== TICKET CREATION FAILED ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Helper function for internal ticket creation
exports.createTicketInternal = async (
  eventId,
  userId,
  ticketTypeId,
  quantity,
  paymentId,
  contactInfo = null
) => {
  try {
    console.log("=== INTERNAL TICKET CREATION ===");

    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Find ticket type
    const ticketType = event.ticketTypes.id(ticketTypeId);
    if (!ticketType) {
      throw new Error("Ticket type not found");
    }

    // Check availability
    if (ticketType.available < quantity) {
      throw new Error("Not enough tickets available");
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Create ticket
    const ticket = new Ticket({
      event: eventId,
      user: userId,
      ticketType: ticketType.name,
      quantity,
      unitPrice: ticketType.price,
      totalAmount: ticketType.price * quantity,
      paymentId,
      paymentStatus: "completed",
    });

    // Generate QR code
    const qrCode = await generateTicketQR(ticket);
    ticket.qrCode = qrCode;

    // Save ticket
    await ticket.save();

    // Update ticket availability
    ticketType.available -= quantity;
    await event.save();

    // Create email recipient object
    const emailRecipient = {
      name: contactInfo?.name || user.name,
      email: contactInfo?.email || user.email,
      phone: contactInfo?.phone || user.phone || "Not provided",
    };

    // Send confirmation email
    const emailResult = await sendTicketEmail(
      emailRecipient,
      ticket,
      event,
      qrCode
    );
    console.log("Internal ticket email result:", emailResult);

    return ticket;
  } catch (error) {
    console.error("Internal ticket creation error:", error);
    throw error;
  }
};

// Public ticket verification
exports.publicVerifyTicket = async (req, res) => {
  try {
    const { ticketId, signature, timestamp } = req.body;

    if (!ticketId || !signature || !timestamp) {
      return res
        .status(400)
        .json({ message: "Missing required verification parameters" });
    }

    const linkAge = Date.now() - parseInt(timestamp);
    if (linkAge > 30 * 24 * 60 * 60 * 1000) {
      return res.status(400).json({ message: "Verification link has expired" });
    }

    const ticket = await Ticket.findById(ticketId)
      .populate({
        path: "event",
        select: "title startDate endDate location organizer",
      })
      .populate({
        path: "user",
        select: "name email",
      });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const signatureData = `${ticketId}:${ticket.event._id}:${timestamp}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.JWT_SECRET || "ticket-secret-key")
      .update(signatureData)
      .digest("hex")
      .substring(0, 16);

    if (signature !== expectedSignature) {
      return res
        .status(400)
        .json({ message: "Invalid ticket verification data" });
    }

    let status = "Valid";
    if (ticket.isCheckedIn) {
      status = "Used";
    } else if (new Date(ticket.event.startDate) < new Date()) {
      status = "Expired";
    }

    res.json({
      status,
      ticket: {
        _id: ticket._id,
        ticketNumber: ticket.ticketNumber,
        ticketType: ticket.ticketType,
        quantity: ticket.quantity,
        unitPrice: ticket.unitPrice,
        totalAmount: ticket.totalAmount,
        isCheckedIn: ticket.isCheckedIn,
        purchasedAt: ticket.purchasedAt,
        event: {
          title: ticket.event.title,
          startDate: ticket.event.startDate,
          endDate: ticket.event.endDate,
          location: ticket.event.location,
        },
      },
    });
  } catch (error) {
    console.error("Public verify ticket error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify ticket for check-in
exports.verifyTicket = async (req, res) => {
  try {
    const { ticketId, qrData } = req.body;

    const ticket = await Ticket.findById(ticketId).populate("event");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (
      req.user.role !== "admin" &&
      ticket.event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (ticket.isCheckedIn) {
      return res
        .status(400)
        .json({ message: "Ticket already used for check-in" });
    }

    const isValid = verifyQRCode(qrData, ticket);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid QR code" });
    }

    ticket.isCheckedIn = true;
    await ticket.save();

    res.json({
      success: true,
      message: "Ticket verified successfully",
      ticket,
    });
  } catch (error) {
    console.error("Verify ticket error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get tickets for an event
exports.getEventTickets = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      req.user.role !== "admin" &&
      event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const tickets = await Ticket.find({ event: req.params.eventId })
      .populate({
        path: "user",
        select: "name email",
      })
      .sort({ purchasedAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error("Get event tickets error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
