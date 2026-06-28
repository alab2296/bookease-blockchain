import { useEffect, useState } from "react";
import { walletService } from "../services/walletService";

export default function useWallet() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);

      const address = await walletService.connectWallet();
      setAccount(address);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    walletService.onAccountsChanged((newAccount) => {
      setAccount(newAccount);
    });
  }, []);

  return {
    account,
    isConnecting,
    connectWallet,
    isConnected: !!account,
  };
}
