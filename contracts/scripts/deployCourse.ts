import hre from "hardhat";

async function main() {
  const courseNFT = await hre.viem.deployContract("CourseNFT");
  console.log("CourseNFT deployed to:", courseNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
