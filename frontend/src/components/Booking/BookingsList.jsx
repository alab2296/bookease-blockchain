import { useEffect, useState } from "react";
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

export default function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setFeedback(null);
      const data = await contractService.getAllBookings();
      setBookings(data || []);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Failed to load bookings",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setFeedback(null);
        const data = await contractService.getAllBookings();
        setBookings(data || []);
      } catch (error) {
        setFeedback({
          type: "error",
          message: error.message || "Failed to load bookings",
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ marginBottom: 0 }}>All Bookings</h2>
        <button onClick={loadBookings} disabled={loading} className="btn-secondary btn-small">
          {loading && <span className="loading-spinner" />}
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          <span>{feedback.message}</span>
        </div>
      )}

      {bookings.length === 0 ? (
        <p className="text-muted" style={{ textAlign: "center", padding: "40px 20px" }}>
          No bookings found
        </p>
      ) : (
        <div className="grid grid-2">
          {bookings.map((b) => (
            <div key={b.id} className="card">
              <div className="card-header">
                <div className="card-title">Booking #{b.id}</div>
                <span className={`badge ${getStatusBadgeClass(b.status)}`}>
                  {getStatusText(b.status)}
                </span>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <span className="text-muted">Amount</span>
                  <p style={{ fontSize: "16px", fontWeight: 600, marginTop: "4px" }}>
                    {b.amount} ETH
                  </p>
                </div>

                <div>
                  <span className="text-muted">Customer</span>
                  <p className="text-small" style={{ fontFamily: "monospace", marginTop: "4px" }}>
                    {b.customer.slice(0, 10)}...{b.customer.slice(-8)}
                  </p>
                </div>

                <div>
                  <span className="text-muted">Provider</span>
                  <p className="text-small" style={{ fontFamily: "monospace", marginTop: "4px" }}>
                    {b.provider === "0x0000000000000000000000000000000000000000"
                      ? "Not assigned"
                      : `${b.provider.slice(0, 10)}...${b.provider.slice(-8)}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
