const hre = require("hardhat");

async function main() {
  console.log("Deploying MemePlatform contract...");

  const MemePlatform = await hre.ethers.getContractFactory("MemePlatform");
  const memePlatform = await MemePlatform.deploy();
  await memePlatform.waitForDeployment();

  console.log("MemePlatform deployed to:", await memePlatform.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});