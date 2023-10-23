import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomiclabs/hardhat-ethers";

require("dotenv").config();

const config = {
  solidity: "0.8.13",
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY ?? ""],
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY ?? ""],
    },
    zkevm: {
      url: `https://polygonzkevm-testnet.g.alchemy.com/v2/${process.env.ALCHEMY_ZK_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY ?? ""],
    },
    scroll: {
      url: `https://sepolia-rpc.scroll.io`,
      accounts: [process.env.PRIVATE_KEY ?? ""],
      // gas: 50000000,
    },
    mantle: {
      url: "https://rpc.testnet.mantle.xyz/",
      accounts: [process.env.PRIVATE_KEY ?? ""],
      // gas: 50000000,
    },
  },
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      sepolia: `${process.env.ETHERSCAN_API_KEY}`,
      scroll: `${process.env.ETHERSCAN_API_KEY}`,
      mantleTestnet: `${process.env.ETHERSCAN_API_KEY}`,
      polygonMumbai: `${process.env.POLYGONSCAN_API_KEY}`,
    },
  },
  customChains: [
    {
      network: "mantleTestnet",
      chainId: 5001,
      urls: {
        //Blockscout
        apiURL: "https://explorer.testnet.mantle.xyz/api",
        browserURL: "https://blockscout.com/gnosis/chiado",
      },
    },
    {
      network: "scroll",
      chainId: 534351,
      urls: {
        apiURL: "https://sepolia-blockscout.scroll.io/api",
        browserURL: "https://sepolia-blockscout.scroll.io/",
      },
    },
    // {
    //   network: "polygonMumbai",
    //   chainId: 80001,
    //   urls: {
    //     apiURL: "https://api-goerli.basescan.org/api",
    //     browserURL: "https://goerli.basescan.org",
    //   },
    // },
  ],
};

export default config;
