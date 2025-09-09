const crypto = require("crypto");

// Generate a ticket verification URL with shortened params
exports.generateTicketQR = async (ticket) => {
  try {
    // Create a verification token based on ticket data
    const verificationData = {
      tid: ticket._id.toString(), // Ticket ID
      eid: ticket.event.toString(), // Event ID
      ts: Date.now(), // Timestamp for additional security
    };

    // Create a signature to prevent tampering
    // Only include critical information in the signature
    const signatureData = `${verificationData.tid}:${verificationData.eid}:${verificationData.ts}`;
    const signature = crypto
      .createHmac("sha256", process.env.JWT_SECRET || "ticket-secret-key")
      .update(signatureData)
      .digest("hex")
      .substring(0, 16); // Short signature to keep URL length reasonable

    // Create a verification URL
    // Using shortened parameter names to reduce QR code size
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/verify?t=${verificationData.tid}&s=${signature}&ts=${verificationData.ts}`;

    return verificationUrl;
  } catch (error) {
    console.error("Error generating ticket QR code:", error);
    throw error;
  }
};

// Verify a QR code against ticket data
exports.verifyQRCode = (qrData, ticket) => {
  try {
    // Parse the URL to extract components
    const url = new URL(qrData);
    const params = new URLSearchParams(url.search);

    const ticketId = params.get("t");
    const signature = params.get("s");
    const timestamp = params.get("ts");

    if (!ticketId || !signature || !timestamp) {
      return false;
    }

    // Recreate the signature for verification
    const signatureData = `${ticketId}:${
      ticket.event._id || ticket.event
    }:${timestamp}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.JWT_SECRET || "ticket-secret-key")
      .update(signatureData)
      .digest("hex")
      .substring(0, 16);

    // Check if signatures match and ticket ID matches
    return (
      signature === expectedSignature && ticketId === ticket._id.toString()
    );
  } catch (error) {
    console.error("Error verifying QR code:", error);
    return false;
  }
};
