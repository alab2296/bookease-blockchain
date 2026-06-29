import { useState } from "react";
import { contractService } from "../../services/contractService";

export default function CancelBooking() {
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleCancelBooking = async () => {
    if (!bookingId || Number(bookingId) <= 0) {
      setFeedback({ type: "error", message: "Please enter a valid booking ID" });
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);

      const tx = await contractService.cancelBooking(bookingId);
      await tx.wait();

      setFeedback({
        type: "success",
        message: `Booking #${bookingId} cancelled and refunded`,
      });
      setBookingId("");
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Failed to cancel booking",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>Cancel Booking</h2>
      <p className="text-muted" style={{ marginBottom: "16px" }}>
        Only available before the booking is accepted
      </p>

      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="cancel-booking-id">Booking ID</label>
        <input
          id="cancel-booking-id"
          type="number"
          placeholder="e.g., 1"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          min="1"
          disabled={loading}
        />
      </div>

      <button
        onClick={handleCancelBooking}
        disabled={loading}
        className="btn-danger"
      >
        {loading && <span className="loading-spinner" />}
        {loading ? "Cancelling..." : "Cancel Booking"}
      </button>
    </div>
  );
}
