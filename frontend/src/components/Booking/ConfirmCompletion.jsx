import { useState } from "react";
import { contractService } from "../../services/contractService";

export default function ConfirmCompletion() {
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleConfirmCompletion = async () => {
    if (!bookingId || Number(bookingId) <= 0) {
      setFeedback({ type: "error", message: "Please enter a valid booking ID" });
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);

      const tx = await contractService.confirmCompletion(bookingId);
      await tx.wait();

      setFeedback({
        type: "success",
        message: `Payment released for booking #${bookingId}`,
      });
      setBookingId("");
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Failed to release payment",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>Release Payment</h2>
      <p className="text-muted" style={{ marginBottom: "16px" }}>
        Customer confirms work is complete and releases ETH to provider
      </p>

      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="confirm-booking-id">Booking ID</label>
        <input
          id="confirm-booking-id"
          type="number"
          placeholder="e.g., 1"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          min="1"
          disabled={loading}
        />
      </div>

      <button
        onClick={handleConfirmCompletion}
        disabled={loading}
        className="btn-success"
      >
        {loading && <span className="loading-spinner" />}
        {loading ? "Processing..." : "Release Payment"}
      </button>
    </div>
  );
}
