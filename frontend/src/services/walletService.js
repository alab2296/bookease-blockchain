import { ethers } from "ethers";

export const walletService = {
  // 1. Check if MetaMask exists
  isMetaMaskInstalled: () => {
    return typeof window !== "undefined" && window.ethereum;
  },

  // 2. Connect wallet
  connectWallet: async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    return accounts[0];
  },

  // 3. Get provider
  getProvider: () => {
    if (!window.ethereum) {
      throw new Error("MetaMask not found");
    }

    return new ethers.BrowserProvider(window.ethereum);
  },

  // 4. Get signer (VERY IMPORTANT)
  getSigner: async () => {
    const provider = walletService.getProvider();
    return await provider.getSigner();
  },

  // 5. Listen to account change
  onAccountsChanged: (callback) => {
    if (!window.ethereum) return;

    window.ethereum.on("accountsChanged", (accounts) => {
      callback(accounts[0] || null);
    });
  },
};
