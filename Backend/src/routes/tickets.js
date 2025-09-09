const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { isAuthenticated } = require("../middleware/auth");

// Get user's tickets
router.get("/my-tickets", isAuthenticated, ticketController.getUserTickets);

// Get single ticket
router.get("/:id", isAuthenticated, ticketController.getTicket);

// Create ticket (no payment required)
router.post("/create", isAuthenticated, ticketController.createTicket);

// Verify ticket (for check-in)
router.post("/verify", isAuthenticated, ticketController.verifyTicket);

router.post("/public-verify", ticketController.publicVerifyTicket);

// Get tickets for an event (admin/organizer only)
router.get(
  "/event/:eventId",
  isAuthenticated,
  ticketController.getEventTickets
);

module.exports = router;
