const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BookingEscrow - Security Tests", function () {
  let contract;
  let customer, provider, attacker;

  const ONE_ETH = ethers.parseEther("1");

  beforeEach(async function () {
    [customer, provider, attacker] = await ethers.getSigners();

    const BookingEscrow = await ethers.getContractFactory("BookingEscrow");
    contract = await BookingEscrow.deploy();
  });

  it("should NOT allow non-customer to cancel booking", async function () {
    await contract.connect(customer).createBooking({
      value: ONE_ETH,
    });

    await expect(contract.connect(attacker).cancelBooking(1)).to.be.reverted;
  });
});
