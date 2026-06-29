import { useState } from "react";
import { contractService } from "../../services/contractService";

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "0":
      return "badge-created";
    case "1":
      return "badge-accepted";
    case "2":
      return "badge-in-progress";
    case "3":
      return "badge-completed";
    case "4":
      return "badge-cancelled";
    default:
      return "";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "0":
      return "Created";
    case "1":
      return "Accepted";
    case "2":
      return "Provider Completed";
    case "3":
      return "Completed";
    case "4":
      return "Cancelled";
    default:
      return "Unknown";
  }
};

export default function ViewBooking() {
  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleGetBooking = async () => {
    if (!bookingId || Number(bookingId) <= 0) {
      setFeedback({ type: "error", message: "Please enter a valid booking ID" });
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);

      const data = await contractService.getBooking(bookingId);
      setBooking(data);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Failed to fetch booking",
      });
      setBooking(null);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>View Booking</h2>

      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          <span>{feedback.message}</span>
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label htmlFor="search-booking-id">Booking ID</label>
          <input
            id="search-booking-id"
            type="number"
            placeholder="e.g., 1"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            min="1"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleGetBooking}
          disabled={loading}
          className="btn-primary"
          style={{ alignSelf: "flex-end" }}
        >
          {loading && <span className="loading-spinner" />}
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {booking && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Booking #{booking.id}</div>
            <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
              {getStatusText(booking.status)}
            </span>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            <div>
              <span className="text-muted">Customer</span>
              <p style={{ fontSize: "12px", fontFamily: "monospace" }}>
                {booking.customer}
              </p>
            </div>
            <div>
              <span className="text-muted">Provider</span>
              <p style={{ fontSize: "12px", fontFamily: "monospace" }}>
                {booking.provider === "0x0000000000000000000000000000000000000000"
                  ? "Not assigned"
                  : booking.provider}
              </p>
            </div>
            <div>
              <span className="text-muted">Amount</span>
              <p style={{ fontSize: "16px", fontWeight: 600 }}>
                {booking.amount} ETH
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
