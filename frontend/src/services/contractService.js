import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../config/contract";
import BookingEscrow from "../abi/BookingEscrow.json";
import { walletService } from "./walletService";

export const contractService = {
  // Get contract with signer (for transactions)
  getContractWithSigner: async () => {
    const signer = await walletService.getSigner();

    return new ethers.Contract(CONTRACT_ADDRESS, BookingEscrow.abi, signer);
  },

  // Read-only contract (no wallet needed)
  getContractReadOnly: () => {
    const provider = walletService.getProvider();

    return new ethers.Contract(CONTRACT_ADDRESS, BookingEscrow.abi, provider);
  },

  // Example: create booking (WRITE transaction)
  createBooking: async (providerAddress, amountInEth) => {
    const contract = await contractService.getContractWithSigner();

    const tx = await contract.createBooking(providerAddress, {
      value: ethers.parseEther(amountInEth),
    });

    return await tx.wait();
  },
};
