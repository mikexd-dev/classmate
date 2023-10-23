import hre from "hardhat";
// import { ethers } from "hardhat";

async function main() {
  console.log("deploying...");
  const profileNft = await hre.viem.deployContract("ProfileNFT");
  // const lock = await ethers.deployContract("AIducationProfile");

  // await lock.waitForDeployment();
  // const simpleStorageFactory = await ethers.getContractFactory(
  //   "AIducationProfile"
  // );
  // console.log("Contract is deploying....");
  // const contractDeploy = await simpleStorageFactory.deploy({ nonce: 1021 });
  // const result = await contractDeploy.deployed();

  console.log("ProfileNFT deployed to:", profileNft.address);

  // const result = await hre.run("verify:verify", {
  //   address: profileNft.address,
  //   constructorArguments: [],
  // });

  // console.log("result", result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
