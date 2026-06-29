import { useEffect, useState } from "react";

import Wallet from "./components/Wallet/Wallet";
import CreateBooking from "./components/Booking/CreateBooking";
import AcceptBooking from "./components/Booking/AcceptBooking";
import CancelBooking from "./components/Booking/CancelBooking";
import ProviderComplete from "./components/Booking/ProviderComplete";
import ConfirmCompletion from "./components/Booking/ConfirmCompletion";
import ViewBooking from "./components/Booking/ViewBooking";
import BookingsList from "./components/Booking/BookingsList";
import { contractService } from "./services/contractService";
import "./App.css";

function App() {
  const [eventNotification, setEventNotification] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const showNotification = (message) => {
    setEventNotification(message);
    setTimeout(() => setEventNotification(null), 4000);
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    let contractInstance = null;

    const setupEvents = async () => {
      try {
        contractInstance = await contractService.getContractInstance();

        contractInstance.on("BookingCreated", (id) => {
          showNotification(`New Booking Created #${id.toString()}`);
          triggerRefresh();
        });

        contractInstance.on("BookingAccepted", (id) => {
          showNotification(`Booking Accepted #${id.toString()}`);
          triggerRefresh();
        });

        contractInstance.on("BookingCompleted", (id) => {
          showNotification(`Booking Completed #${id.toString()}`);
          triggerRefresh();
        });
      } catch (err) {
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
    <div id="root">
      <header className="header">
        <div className="container">
          <h1>⚡ BookEase DApp</h1>
          <p>Decentralized booking and escrow system on Ethereum</p>
        </div>
      </header>

      <main className="container">
        {eventNotification && (
          <div className="alert alert-success" style={{ marginBottom: "20px" }}>
            🔔 {eventNotification}
          </div>
        )}

        <Wallet />

        <section style={{ marginTop: "40px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>
            Booking Actions
          </h2>

          <div className="grid grid-2">
            <CreateBooking />
            <AcceptBooking />
            <CancelBooking />
            <ProviderComplete />
            <ConfirmCompletion />
            <ViewBooking />
          </div>
        </section>

        <section style={{ marginTop: "40px", marginBottom: "60px" }}>
          <BookingsList key={refreshTrigger} />
        </section>
      </main>
    </div>
  );
}

export default App;
