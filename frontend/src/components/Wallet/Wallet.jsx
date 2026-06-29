import useWallet from "../../hooks/useWallet";

export default function Wallet() {
  const { account, connectWallet, isConnecting, isConnected } = useWallet();

  return (
    <div className="section" style={{ marginBottom: "40px" }}>
      <h2>Wallet Connection</h2>

      {!isConnected ? (
        <p className="text-muted" style={{ marginBottom: "16px" }}>
          Connect your MetaMask wallet to interact with the BookEase DApp
        </p>
      ) : null}

      {!isConnected ? (
        <button onClick={connectWallet} disabled={isConnecting} className="btn-primary">
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "20px" }}>✅</span>
          <div style={{ textAlign: "left" }}>
            <p className="text-muted">Connected Account</p>
            <p style={{ fontSize: "14px", fontFamily: "monospace", fontWeight: 600 }}>
              {account.slice(0, 10)}...{account.slice(-8)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
