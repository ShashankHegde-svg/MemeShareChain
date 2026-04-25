require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",       // ← changed from 0.8.20 to 0.8.24
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    amoy: {
      url: process.env.ALCHEMY_AMOY_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};