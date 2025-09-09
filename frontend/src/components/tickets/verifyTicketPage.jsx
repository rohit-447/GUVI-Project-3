import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {formatDate ,formatTime} from "../../utils/dateFormatter";
import { formatPrice } from "../../utils/priceFormatter";

const VerifyTicketPage = () => {
  const [searchParams] = useSearchParams();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const ticketId = searchParams.get("t");
  const signature = searchParams.get("s");
  const timestamp = searchParams.get("ts");

  useEffect(() => {
    const verifyTicket = async () => {
      try {
        if (!ticketId || !signature || !timestamp) {
          throw new Error("Invalid ticket verification link");
        }

        setLoading(true);

        // Call the API to verify the ticket
        const response = await fetch(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000/api"
          }/tickets/public-verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ticketId,
              signature,
              timestamp,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to verify ticket");
        }

        const data = await response.json();
        setTicketData(data.ticket);
        setStatus(data.status);
      } catch (err) {
        console.error("Verification error:", err);
        setError(err.message || "Failed to verify ticket");
      } finally {
        setLoading(false);
      }
    };

    verifyTicket();
  }, [ticketId, signature, timestamp]);

  if (loading) {
    return (
      <div className="verify-page loading">
        <div className="container">
          <h1>Verifying Ticket</h1>
          <div className="loading-indicator">Checking ticket validity...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="verify-page error">
        <div className="container">
          <h1>Verification Failed</h1>
          <div className="error-message">{error}</div>
          <div className="actions">
            <Link to="/" className="btn btn-primary">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-page">
      <div className="container">
        <div className={`ticket-verification ${status?.toLowerCase()}`}>
          <div className="verification-header">
            <h1>Ticket Verification</h1>
            <div className="status-badge">{status}</div>
          </div>

          {ticketData && (
            <div className="ticket-details">
              <h2>{ticketData.event.title}</h2>

              <div className="info-grid">
                <div className="info-group">
                  <h3>Event Details</h3>
                  <div className="info-row">
                    <span className="label">Date</span>
                    <span className="value">
                      {formatDate(ticketData.event.startDate)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Time</span>
                    <span className="value">
                      {formatDate(ticketData.event.startDate)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Location</span>
                    <span className="value">{ticketData.event.location}</span>
                  </div>
                </div>

                <div className="info-group">
                  <h3>Ticket Information</h3>
                  <div className="info-row">
                    <span className="label">Ticket Type</span>
                    <span className="value">{ticketData.ticketType}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Quantity</span>
                    <span className="value">{ticketData.quantity}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Price</span>
                    <span className="value">
                      {formatPrice(ticketData.totalAmount)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Ticket #</span>
                    <span className="value">{ticketData.ticketNumber}</span>
                  </div>
                </div>
              </div>

              <div className="status-info">
                {ticketData.isCheckedIn ? (
                  <p>This ticket has already been used for entry.</p>
                ) : new Date(ticketData.event.startDate) < new Date() ? (
                  <p>This ticket has expired.</p>
                ) : (
                  <p>
                    Valid ticket. Please present this ticket at the event
                    entrance.
                  </p>
                )}
              </div>

              <div className="actions">
                <Link to="/my-tickets" className="btn btn-primary">
                  View My Tickets
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyTicketPage;
