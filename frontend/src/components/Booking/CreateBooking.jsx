import { useState } from "react";
import { contractService } from "../../services/contractService";

export default function CreateBooking() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleCreateBooking = async () => {
    if (!amount || Number(amount) <= 0) {
      setFeedback({ type: "error", message: "Please enter a valid amount" });
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);

      const tx = await contractService.createBooking(amount);
      await tx.wait();

      setFeedback({
        type: "success",
        message: `Booking created! TX: ${tx.hash}`,
      });
      setAmount("");
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Failed to create booking",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>Create Booking</h2>

      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="amount">Amount (ETH)</label>
        <input
          id="amount"
          type="number"
          placeholder="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0"
          disabled={loading}
        />
      </div>

      <button
        onClick={handleCreateBooking}
        disabled={loading}
        className="btn-primary"
      >
        {loading && <span className="loading-spinner" />}
        {loading ? "Processing..." : "Create Booking"}
      </button>
    </div>
  );
}
