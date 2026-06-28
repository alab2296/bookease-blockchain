import useWallet from "../../hooks/useWallet";

export default function Wallet() {
  const { account, connectWallet, isConnecting, isConnected } = useWallet();

  return (
    <div style={styles.container}>
      {!isConnected ? (
        <button style={styles.button} onClick={connectWallet}>
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div style={styles.connected}>
          <p>✅ Connected Wallet:</p>
          <p style={styles.address}>
            {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  connected: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    display: "inline-block",
  },
  address: {
    fontWeight: "bold",
  },
};
