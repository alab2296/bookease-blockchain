const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BookingEscrow - Full Flow", function () {
  let contract;
  let customer, provider;

  const ONE_ETH = ethers.parseEther("1");

  beforeEach(async function () {
    [customer, provider] = await ethers.getSigners();

    const BookingEscrow = await ethers.getContractFactory("BookingEscrow");
    contract = await BookingEscrow.deploy();
  });

  it("should complete full escrow lifecycle", async function () {
    // 1. Customer creates booking (NO parameters)
    await contract.connect(customer).createBooking({
      value: ONE_ETH,
    });

    let booking = await contract.bookings(1);

    expect(booking.customer).to.equal(customer.address);
    expect(booking.amount).to.equal(ONE_ETH);
    expect(booking.status).to.equal(0); // Created

    // Provider is NOT assigned yet
    expect(booking.provider).to.equal(
      "0x0000000000000000000000000000000000000000",
    );

    // 2. Provider accepts booking
    await contract.connect(provider).acceptBooking(1);

    booking = await contract.bookings(1);
    expect(booking.provider).to.equal(provider.address);
    expect(booking.status).to.equal(1); // Accepted

    // 3. Provider marks completion
    await contract.connect(provider).providerComplete(1);

    booking = await contract.bookings(1);
    expect(booking.status).to.equal(2); // ProviderCompleted

    // 4. Customer confirms completion
    const providerBefore = await ethers.provider.getBalance(provider.address);

    await contract.connect(customer).confirmCompletion(1);

    booking = await contract.bookings(1);
    expect(booking.status).to.equal(3); // Completed

    const providerAfter = await ethers.provider.getBalance(provider.address);

    // 5. ETH was transferred
    expect(providerAfter).to.be.gt(providerBefore);
  });
});
