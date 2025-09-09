const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ticketType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  qrCode: {
    type: String,
  },
  ticketNumber: {
    type: String,
    unique: true,
  },
  isCheckedIn: {
    type: Boolean,
    default: false,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate unique ticket number before saving
TicketSchema.pre("save", async function (next) {
  if (!this.ticketNumber) {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    this.ticketNumber = `TKT-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model("Ticket", TicketSchema);
