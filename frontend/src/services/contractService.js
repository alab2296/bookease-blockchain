import { ethers } from "ethers";
import BookingEscrow from "../abi/BookingEscrow.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function getContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(contractAddress, BookingEscrow.abi, signer);
}

export const contractService = {
  // 🟢 CREATE BOOKING
  async createBooking(amount) {
    const contract = await getContract();

    const tx = await contract.createBooking({
      value: ethers.parseEther(amount.toString()),
    });

    return tx;
  },

  // 🔵 ACCEPT BOOKING
  async acceptBooking(bookingId) {
    const contract = await getContract();

    const tx = await contract.acceptBooking(bookingId);

    return tx;
  },

  // 🟡 PROVIDER MARK COMPLETE
  async providerComplete(bookingId) {
    const contract = await getContract();

    const tx = await contract.providerComplete(bookingId);

    return tx;
  },

  // 🔴 CUSTOMER CONFIRMS + RELEASES ETH
  async confirmCompletion(bookingId) {
    const contract = await getContract();

    const tx = await contract.confirmCompletion(bookingId);

    return tx;
  },

  // ❌ CANCEL BOOKING (only before acceptance)
  async cancelBooking(bookingId) {
    const contract = await getContract();

    const tx = await contract.cancelBooking(bookingId);

    return tx;
  },

  // 🔍 GET SINGLE BOOKING
  async getBooking(bookingId) {
    const contract = await getContract();

    const b = await contract.getBooking(bookingId);

    return {
      id: b.id.toString(),
      customer: b.customer,
      provider: b.provider,
      amount: ethers.formatEther(b.amount),
      status: b.status.toString(),
    };
  },

  // 📋 GET ALL BOOKINGS
  async getAllBookings() {
    const contract = await getContract();

    const count = await contract.bookingCount();
    const bookings = [];

    for (let i = 1; i <= Number(count); i++) {
      const b = await contract.getBooking(i);
      bookings.push({
        id: b.id.toString(),
        customer: b.customer,
        provider: b.provider,
        amount: ethers.formatEther(b.amount),
        status: b.status.toString(),
      });
    }

    return bookings;
  },

  // 🔗 GET CONTRACT INSTANCE (for event listeners)
  async getContractInstance() {
    return getContract();
  },
};
