import hre from "hardhat";
// import { ethers } from "hardhat";

async function main() {
  console.log("deploying...");
  const profileNft = await hre.viem.deployContract("ProfileNFT");
  console.log("ProfileNFT deployed to:", profileNft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
