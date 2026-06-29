import { useEffect, useState } from "react";

import Wallet from "./components/Wallet/Wallet";
import CreateBooking from "./components/Booking/CreateBooking";
import AcceptBooking from "./components/Booking/AcceptBooking";
import { contractService } from "./services/contractService";

function App() {
  // ================= STATE =================
  const [completeId, setCompleteId] = useState("");
  const [confirmId, setConfirmId] = useState("");
  const [searchId, setSearchId] = useState("");

  const [booking, setBooking] = useState(null);
  const [allBookings, setAllBookings] = useState([]);

  const [toast, setToast] = useState("");

  // ================= STATUS =================
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

  // ================= TOAST =================
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ================= PROVIDER COMPLETE =================
  const handleProviderComplete = async () => {
    try {
      const tx = await contractService.providerComplete(completeId);
      await tx.wait();
      showToast("Provider marked complete");
      loadAllBookings();
    } catch (err) {
      console.error(err);
      showToast("Provider complete failed");
    }
  };

  // ================= CONFIRM COMPLETION =================
  const handleConfirmCompletion = async () => {
    try {
      const tx = await contractService.confirmCompletion(confirmId);
      await tx.wait();
      showToast("Payment released");
      loadAllBookings();
    } catch (err) {
      console.error(err);
      showToast("Confirm failed");
    }
  };

  // ================= SINGLE BOOKING =================
  const handleGetBooking = async () => {
    try {
      const data = await contractService.getBooking(searchId);
      setBooking(data);
    } catch (err) {
      console.error(err);
      showToast("Fetch failed");
    }
  };

  // ================= ALL BOOKINGS =================
  const loadAllBookings = async () => {
    try {
      const data = await contractService.getAllBookings();
      setAllBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= LIVE EVENT LISTENERS =================
  useEffect(() => {
    let contractInstance = null;

    const setupEvents = async () => {
      try {
        contractInstance = await contractService.getContractInstance();

        contractInstance.on("BookingCreated", (id) => {
          showToast(`New Booking Created #${id.toString()}`);
          loadAllBookings();
        });

        contractInstance.on("BookingAccepted", (id) => {
          showToast(`Booking Accepted #${id.toString()}`);
          loadAllBookings();
        });

        contractInstance.on("BookingCompleted", (id) => {
          showToast(`Booking Completed #${id.toString()}`);
          loadAllBookings();
        });
      } catch (err) {
        // MetaMask not connected yet — events will be set up on connect
        console.warn("Event listener setup skipped:", err.message);
      }
    };

    setupEvents();

    return () => {
      if (contractInstance) {
        contractInstance.removeAllListeners();
      }
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>BookEase DApp ⚡</h1>

      {/* TOAST */}
      {toast && (
        <div
          style={{
            background: "black",
            color: "white",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {toast}
        </div>
      )}

      {/* WALLET */}
      <Wallet />

      {/* CREATE */}
      <CreateBooking />

      <hr />

      {/* ACCEPT */}
      <AcceptBooking />

      {/* PROVIDER COMPLETE */}
      <hr />
      <h3>Provider Complete</h3>

      <input
        placeholder="Booking ID"
        value={completeId}
        onChange={(e) => setCompleteId(e.target.value)}
      />
      <button onClick={handleProviderComplete}>Mark Complete</button>

      {/* CONFIRM */}
      <hr />
      <h3>Confirm Payment</h3>

      <input
        placeholder="Booking ID"
        value={confirmId}
        onChange={(e) => setConfirmId(e.target.value)}
      />
      <button onClick={handleConfirmCompletion}>Release Payment</button>

      {/* SINGLE */}
      <hr />
      <h3>View Booking</h3>

      <input
        placeholder="Booking ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />
      <button onClick={handleGetBooking}>Get Booking</button>

      {booking && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <p>
            <b>ID:</b> {booking.id}
          </p>
          <p>
            <b>Customer:</b> {booking.customer}
          </p>
          <p>
            <b>Provider:</b> {booking.provider}
          </p>
          <p>
            <b>Amount:</b> {booking.amount} ETH
          </p>
          <p>
            <b>Status:</b> {getStatusText(booking.status)}
          </p>
        </div>
      )}

      {/* ALL BOOKINGS */}
      <hr />
      <h3>Live Bookings Dashboard</h3>

      <button onClick={loadAllBookings}>Refresh</button>

      {allBookings.map((b) => (
        <div
          key={b.id}
          style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}
        >
          <p>
            <b>ID:</b> {b.id}
          </p>
          <p>
            <b>Customer:</b> {b.customer}
          </p>
          <p>
            <b>Provider:</b> {b.provider}
          </p>
          <p>
            <b>Amount:</b> {b.amount} ETH
          </p>
          <p>
            <b>Status:</b> {getStatusText(b.status)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
