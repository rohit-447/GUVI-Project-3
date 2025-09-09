const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { isAuthenticated } = require("../middleware/auth");
const { isAdmin } = require("../middleware/admin");

// Public routes
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEvent);

// Protected routes
router.post("/", isAuthenticated, isAdmin, eventController.createEvent);
router.put("/:id", isAuthenticated, eventController.updateEvent);
router.delete("/:id", isAuthenticated, eventController.deleteEvent);
router.get("/user/myevents", isAuthenticated, eventController.getUserEvents);

module.exports = router;
