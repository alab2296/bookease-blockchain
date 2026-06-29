import { useState } from "react";
import { contractService } from "../../services/contractService";

export default function ProviderComplete() {
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleProviderComplete = async () => {
    if (!bookingId || Number(bookingId) <= 0) {
      setFeedback({ type: "error", message: "Please enter a valid booking ID" });
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);

      const tx = await contractService.providerComplete(bookingId);
      await tx.wait();

      setFeedback({
        type: "success",
        message: `Booking #${bookingId} marked as complete`,
      });
      setBookingId("");
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Failed to mark complete",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>Mark Work Complete</h2>
      <p className="text-muted" style={{ marginBottom: "16px" }}>
        Provider marks their work as finished (awaiting customer confirmation)
      </p>

      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="complete-booking-id">Booking ID</label>
        <input
          id="complete-booking-id"
          type="number"
          placeholder="e.g., 1"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          min="1"
          disabled={loading}
        />
      </div>

      <button
        onClick={handleProviderComplete}
        disabled={loading}
        className="btn-success"
      >
        {loading && <span className="loading-spinner" />}
        {loading ? "Processing..." : "Mark Complete"}
      </button>
    </div>
  );
}
