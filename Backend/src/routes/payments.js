const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { isAuthenticated } = require("../middleware/auth");

// Create payment order
router.post(
  "/create-payment-order",
  isAuthenticated,
  paymentController.createPaymentOrder
);

// Verify payment
router.post(
  "/verify-payment",
  isAuthenticated,
  paymentController.verifyPayment
);

// Razorpay webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

module.exports = router;
