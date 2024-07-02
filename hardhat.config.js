

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
// require("@nomiclabs/hardhat-etherscan");
// require('@nomicfoundation/hardhat-verify')/
// require("./tasks/block-number")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers");
// require("hardhat-deploy");
// require("@nomiclabs/hardhat-waffle");

const SEPOLIA_RPC_URL=process.env.SEPOLIA_RPC_URL || "https://eth-sepolia/example";
const PRIVATE_KEY=process.env.PRIVATE_KEY||"0xkey";
const ETHERSCAN_API_KEY=process.env.ETHERSCAN_API_KEY||"key";
const COINMARKET_API_KEY=process.env.COINMARKET_API_KEY||"key";



/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork:"hardhat",
  networks:{
    sepolia:{
      url:SEPOLIA_RPC_URL,
      accounts:[PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations:6,
      
    },
    localhost:{
      url:"http://127.0.0.1:8545/",
      // accounts:[PRIVATE_KEY],
      chainId: 31337,
    },
  },
  // solidity: "0.8.24",
  solidity:{
      compilers:[
        {version:"0.8.24"},
        {version:"0.6.6"}
        
      ]
  },
  etherscan:{
    apiKey:ETHERSCAN_API_KEY,
  },
  gasReporter:{
    enabled:false,
    outputFile:"gas-report.txt",
    noColors:true,
    currency:"INR",
    // coinmarketcap:COINMARKET_API_KEY,
    // token:"MATIC",
  },
  namedAccounts: {
    deployer: {
        default: 0,
        1:0,
    },}
};

