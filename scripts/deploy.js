const { ethers } = require("hardhat");

async function main() {
  const BookingEscrow = await ethers.getContractFactory("BookingEscrow");
  const contract = await BookingEscrow.deploy();

  await contract.waitForDeployment();

  console.log("BookingEscrow deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//0x5FbDB2315678afecb367f032d93F642f64180aa3
