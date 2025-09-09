const Razorpay = require("razorpay");
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const { createTicketInternal } = require("./ticketController");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET,
});

// Helper function to generate a short receipt ID
const generateShortReceipt = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  // Take last 6 digits of timestamp + 3 digit random = 9 characters
  // Plus "rcpt_" prefix = 14 characters total (well under 40 limit)
  return `rcpt_${timestamp.slice(-6)}${random}`;
};

// Create payment order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { eventId, ticketTypeId, quantity, contactInfo } = req.body;

    // Validate request data
    if (!eventId || !ticketTypeId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Validate contact info
    if (
      !contactInfo ||
      !contactInfo.name ||
      !contactInfo.email ||
      !contactInfo.phone
    ) {
      return res
        .status(400)
        .json({ message: "Contact information is required" });
    }

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find ticket type
    const ticketType = event.ticketTypes.id(ticketTypeId);
    if (!ticketType) {
      return res.status(404).json({ message: "Ticket type not found" });
    }

    // Check availability
    if (ticketType.available < quantity) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    // Calculate amount
    const amount = ticketType.price * quantity * 100; // Razorpay requires amount in paise

    // Generate short receipt ID (under 40 characters)
    const shortReceipt = generateShortReceipt();

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: shortReceipt,
      notes: {
        eventId,
        ticketTypeId,
        quantity: quantity.toString(),
        userId: req.user.id,
        contactName: contactInfo.name,
        contactEmail: contactInfo.email,
        contactPhone: contactInfo.phone,
      },
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: require("../config/config").RAZORPAY_KEY_ID,
      eventTitle: event.title,
      ticketTypeName: ticketType.name,
      quantity: quantity,
      userEmail: req.user.email,
      userName: contactInfo.name,
      userPhone: contactInfo.phone,
    });
  } catch (error) {
    console.error("Create payment order error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    console.log("=== PAYMENT VERIFICATION ===");
    console.log("Order ID:", razorpay_order_id);
    console.log("Payment ID:", razorpay_payment_id);
    console.log("Request user:", req.user);

    // Validate required parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment parameters",
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", require("../config/config").RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.log("✗ Signature verification failed");
      return res.status(400).json({
        success: false,
        message: "Payment verification failed - invalid signature",
      });
    }

    console.log("✓ Signature verified");

    // Get order and payment details from Razorpay
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    console.log("Order notes:", order.notes);
    console.log("Payment status:", payment.status);

    if (payment.status !== "captured") {
      console.log("✗ Payment not captured");
      return res.status(400).json({
        success: false,
        message: "Payment not captured",
      });
    }

    // Extract data from order notes
    const {
      eventId,
      ticketTypeId,
      quantity,
      userId,
      contactName,
      contactEmail,
      contactPhone,
    } = order.notes;

    // Validate extracted data
    if (!eventId || !ticketTypeId || !quantity || !userId) {
      console.log("✗ Missing required data in order notes");
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
      });
    }

    console.log("Extracted data:");
    console.log("- Event ID:", eventId);
    console.log("- Ticket Type ID:", ticketTypeId);
    console.log("- Quantity:", quantity);
    console.log("- User ID:", userId);

    // Check if ticket already exists for this payment
    const existingTicket = await Ticket.findOne({
      paymentId: razorpay_payment_id,
    });
    if (existingTicket) {
      console.log("✓ Ticket already exists for this payment");
      return res.json({
        success: true,
        message: "Payment already processed",
        ticketId: existingTicket._id,
        paymentId: razorpay_payment_id,
      });
    }

    // Create ticket using internal function
    console.log("Creating ticket...");
    const ticket = await createTicketInternal(
      eventId,
      userId,
      ticketTypeId,
      parseInt(quantity),
      razorpay_payment_id,
      {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
      }
    );

    console.log("✓ Ticket created successfully");

    res.json({
      success: true,
      message: "Payment verified and ticket created successfully",
      ticketId: ticket._id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("=== PAYMENT VERIFICATION FAILED ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// Process payment webhook
exports.handleWebhook = async (req, res) => {
  try {
    console.log("=== WEBHOOK RECEIVED ===");
    console.log("Headers:", req.headers);
    console.log("Body:", JSON.stringify(req.body, null, 2));

    const webhookSecret = require("../config/config").RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!webhookSecret) {
      console.log("⚠ Webhook secret not configured");
      return res.status(400).json({ message: "Webhook secret not configured" });
    }

    if (!signature) {
      console.log("✗ Missing webhook signature");
      return res.status(400).json({ message: "Missing signature" });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (signature !== expectedSignature) {
      console.log("✗ Invalid webhook signature");
      return res.status(400).json({ message: "Invalid signature" });
    }

    console.log("✓ Webhook signature verified");

    const event = req.body;

    // Handle payment success event
    if (event.event === "payment.captured") {
      console.log("Processing payment.captured event");

      const payment = event.payload.payment.entity;
      const {
        eventId,
        ticketTypeId,
        quantity,
        userId,
        contactName,
        contactEmail,
        contactPhone,
      } = payment.notes;

      console.log("Payment notes:", payment.notes);

      // Validate required data
      if (!eventId || !ticketTypeId || !quantity || !userId) {
        console.log("✗ Missing required data in payment notes");
        return res.status(400).json({ message: "Invalid payment data" });
      }

      // Check if ticket already exists for this payment
      const existingTicket = await Ticket.findOne({ paymentId: payment.id });
      if (existingTicket) {
        console.log("✓ Ticket already exists for payment:", payment.id);
      } else {
        console.log("Creating ticket from webhook...");
        // Create ticket using internal function
        await createTicketInternal(
          eventId,
          userId,
          ticketTypeId,
          parseInt(quantity),
          payment.id,
          {
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
          }
        );
        console.log("✓ Ticket created from webhook");
      }
    } else {
      console.log("Ignoring webhook event:", event.event);
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("=== WEBHOOK ERROR ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    res.status(400).json({ message: `Webhook Error: ${error.message}` });
  }
};
