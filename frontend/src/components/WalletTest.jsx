import { useState } from "react";
import { ethers } from "ethers";
import { contractAddress } from "../config/contract";
import contractABI from "../abi/BookingEscrow.json";

export default function WalletTest() {
  const [account, setAccount] = useState("");

  async function connect() {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  }

  async function createBooking() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      contractAddress,
      contractABI.abi,
      signer,
    );

    const tx = await contract.createBooking({
      value: ethers.parseEther("1"),
    });

    await tx.wait();

    alert("Booking created successfully!");
  }

  return (
    <div>
      <button onClick={connect}>Connect Wallet</button>
      <p>{account}</p>

      <button onClick={createBooking}>Create Booking (1 ETH)</button>
    </div>
  );
}
