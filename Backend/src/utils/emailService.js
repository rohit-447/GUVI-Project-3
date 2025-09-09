const nodemailer = require("nodemailer");
const config = require("../config/config");

// Enhanced transporter with app-specific password
const createTransporter = () => {
  console.log("Creating email transporter with config:");
  console.log("EMAIL_USER:", config.EMAIL_USER ? "✓ Set" : "✗ Missing");
  console.log("EMAIL_PASS:", config.EMAIL_PASS ? "✓ Set" : "✗ Missing");

  if (!config.EMAIL_USER || !config.EMAIL_PASS) {
    throw new Error(
      `Missing email configuration: ${[
        !config.EMAIL_USER && "EMAIL_USER",
        !config.EMAIL_PASS && "EMAIL_PASS",
      ]
        .filter(Boolean)
        .join(", ")}`
    );
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
    debug: true,
  });

  return transporter;
};

// Test email configuration
exports.testEmailConfig = async () => {
  try {
    console.log("Testing email configuration...");
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✓ Email configuration is valid and ready to send emails");
    return { success: true, message: "Email configuration verified" };
  } catch (error) {
    console.error("✗ Email configuration error:", error);
    return { success: false, error: error.message };
  }
};

// Send a simple test email
exports.sendTestEmail = async (recipientEmail) => {
  try {
    console.log(`Sending test email to: ${recipientEmail}`);
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Event Tickets Test" <${config.EMAIL_USER}>`,
      to: recipientEmail,
      subject: "Test Email - Event Ticket System",
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from your Event Ticket System.</p>
        <p>If you receive this, your email configuration is working correctly!</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `,
      text: `Test Email - Event Ticket System\n\nThis is a test email. If you receive this, your email configuration is working!\n\nSent at: ${new Date().toLocaleString()}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✓ Test email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("✗ Test email failed:", error);
    return { success: false, error: error.message };
  }
};

// Send email with ticket details
exports.sendTicketEmail = async (user, ticket, event, qrCode) => {
  console.log("=== STARTING EMAIL SEND PROCESS ===");
  console.log("Recipient:", user.email);
  console.log("Event:", event.title);
  console.log("Ticket Number:", ticket.ticketNumber);

  try {
    // Validate required parameters
    if (!user || !user.email) {
      throw new Error("User email is required");
    }

    if (!ticket) {
      throw new Error("Ticket data is required");
    }

    if (!event) {
      throw new Error("Event data is required");
    }

    console.log("✓ All required parameters validated");

    // Check email configuration
    if (!config.EMAIL_USER || !config.EMAIL_PASS) {
      throw new Error(
        `Missing email configuration: ${[
          !config.EMAIL_USER && "EMAIL_USER",
          !config.EMAIL_PASS && "EMAIL_PASS",
        ]
          .filter(Boolean)
          .join(", ")}`
      );
    }

    console.log("✓ Email configuration validated");

    const transporter = createTransporter();

    // Test transporter before sending
    await transporter.verify();
    console.log("✓ Email transporter verified");

    // Format date and time for better readability
    const eventDate = new Date(event.startDate);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedTime = eventDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Calculate total amount for display
    const totalAmount =
      ticket.totalAmount || ticket.unitPrice * ticket.quantity;

    console.log("✓ Email content prepared");

    const mailOptions = {
      from: `"Event Tickets" <${config.EMAIL_USER}>`,
      to: user.email,
      subject: `🎫 Your Ticket Confirmation for ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>🎫 Event Ticket Confirmation</h2>
          <p>Your booking is confirmed!</p>
          <h3>Dear ${user.name},</h3>
          <p>Thank you for your booking! Your ticket has been confirmed for ${
            event.title
          }.</p>
          
          <h3>📅 Event Details</h3>
          <ul>
            <li><strong>Event:</strong> ${event.title}</li>
            <li><strong>Date:</strong> ${formattedDate}</li>
            <li><strong>Time:</strong> ${formattedTime}</li>
            <li><strong>Venue:</strong> ${event.location}</li>
          </ul>
          
          <h3>🎟️ Ticket Information</h3>
          <ul>
            <li><strong>Ticket Number:</strong> ${ticket.ticketNumber}</li>
            <li><strong>Type:</strong> ${ticket.ticketType}</li>
            <li><strong>Quantity:</strong> ${ticket.quantity}</li>
            ${
              totalAmount > 0
                ? `<li><strong>Total:</strong> ₹${totalAmount.toLocaleString()}</li>`
                : ""
            }
          </ul>

          ${
            qrCode
              ? `
            <h3>📱 Your QR Code</h3>
            <p>Present this at the event entrance</p>
            <img src="${qrCode}" alt="Ticket QR Code" style="max-width: 200px;">
          `
              : ""
          }

          <h3>Important:</h3>
          <ul>
            <li>Arrive 30 minutes early</li>
            <li>Bring valid ID</li>
            <li>Keep this email safe</li>
          </ul>
          
          <p style="margin-top: 20px;">Event Management System</p>
        </div>
      `,
      text: `
        EVENT TICKET CONFIRMATION
        
        Dear ${user.name},
        
        Your ticket for ${event.title} is confirmed!
        
        Event: ${event.title}
        Date: ${formattedDate}
        Time: ${formattedTime}
        Venue: ${event.location}
        
        Ticket: ${ticket.ticketNumber}
        Type: ${ticket.ticketType}
        Quantity: ${ticket.quantity}
        
        Please arrive 30 minutes early with valid ID.
      `,
    };

    console.log("✓ Sending email...");
    const info = await transporter.sendMail(mailOptions);

    console.log("✓ EMAIL SENT SUCCESSFULLY!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
    console.log("=== EMAIL SEND COMPLETE ===");

    return {
      success: true,
      messageId: info.messageId,
      recipient: user.email,
      response: info.response,
    };
  } catch (error) {
    console.error("✗ EMAIL SEND FAILED!");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("=== EMAIL SEND FAILED ===");

    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};
