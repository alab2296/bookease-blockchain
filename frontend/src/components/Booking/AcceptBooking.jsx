import { useState } from "react";
import { contractService } from "../../services/contractService";

function AcceptBooking() {
  const [bookingId, setBookingId] = useState("");

  const handleAcceptBooking = async () => {
    try {
      const tx = await contractService.acceptBooking(bookingId);
      await tx.wait();

      alert("Booking accepted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to accept booking.");
    }
  };

  return (
    <div>
      <h2>Accept Booking</h2>

      <input
        type="number"
        placeholder="Booking ID"
        value={bookingId}
        onChange={(e) => setBookingId(e.target.value)}
      />

      <button onClick={handleAcceptBooking}>Accept Booking</button>
    </div>
  );
}

export default AcceptBooking;
