import { useState } from "react";
import { contractService } from "../../services/contractService";

export default function CreateBooking() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const handleCreateBooking = async () => {
    try {
      setLoading(true);
      setTxHash("");

      const tx = await contractService.createBooking(amount);

      setTxHash(tx.hash);
      alert("Booking created successfully!");
    } catch (error) {
      console.error(error);
      alert("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Booking</h2>

      <input
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleCreateBooking} style={styles.button}>
        {loading ? "Processing..." : "Create Booking"}
      </button>

      {txHash && <p style={styles.tx}>TX: {txHash}</p>}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    border: "1px solid #ddd",
    marginTop: "20px",
    borderRadius: "8px",
  },
  input: {
    display: "block",
    margin: "10px 0",
    padding: "8px",
    width: "300px",
  },
  button: {
    padding: "10px 15px",
    cursor: "pointer",
  },
  tx: {
    marginTop: "10px",
    fontSize: "12px",
    color: "green",
  },
};
