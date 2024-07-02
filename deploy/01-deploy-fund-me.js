


// function deployFunc(){
//     console.log("Deployingg 1..");
// }

const { network } = require("hardhat")
// const { getNamedAccounts, deployments } = require("hardhat");

// module.exports.default = deployFunc

const {networkConfig, developmentChains}=require("../helper-hardhat-config");
const {verify}=require("../utils/verify")
// const helperConfig =require("../helper-hardhat-config");
// const networkConfig =helperConfig.networkConfig


module.exports =async({getNamedAccounts,deployments})=>{
    const {deploy,log,get}=deployments
    const {deployer}=await getNamedAccounts()
    const chainId=network.config.chainId;


    // const ethUsdPriceFeedAddress= networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    }else{
        ethUsdPriceFeedAddress= networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const args=[ethUsdPriceFeedAddress]
    const fundMe =await deploy("FundMe",{
        from: deployer,
        args :args,
        log:true,
        waitConformations: network.config.blockConfirmations||1,
    });

    if ( !developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(fundMe.address,args)
    }

    log("--------------------------------------------------");


}

module.exports.tags=["all","fund-me"]