const { deployments, ethers, getNamedAccounts } = require("hardhat")
const {assert,expect} =require("chai");
describe ("FundMe",async function(){

let fundMe
let deployer
let mockV3Aggregator
const sendValue = ethers.parseEther("1"); 
beforeEach(async function(){


    // const accounts= await ethers.getSigners();
    // const accountzERO =accounts[0];
    deployer = (await getNamedAccounts()).deployer;

    await deployments.fixture("all");
    const fundMeContract = await deployments.get("FundMe");
    fundMe = await ethers.getContractAt("FundMe", fundMeContract.address);

    const mockV3AggregatorAddress = await deployments.get("MockV3Aggregator");

    mockV3Aggregator = await ethers.getContractAt(
      "MockV3Aggregator",
      mockV3AggregatorAddress.address
    );

})


    describe("constructor",async function(){
        it("sets the aggregator address correctly",async function(){
            const response =await fundMe.getPriceFeed();
            // console.log(response);
            assert.equal(response,mockV3Aggregator.target);
        })
    })


    describe("fund", function () {
        // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
        // could also do assert.fail
        it("Fails if you don't send enough ETH", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
        // we could be even more precise here by making sure exactly $50 works
        // but this is good enough for now
        it("Updates the amount funded data structure", async () => {
            console.log("===============")
            await fundMe.fund({ value: sendValue })
            console.log("=========")
            const response = await fundMe.getAddressToAmountFunded(
                deployer
            )
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of funders", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getFunder(0)
            assert.equal(response, deployer)
        })
    })



    describe("withdraw", function () {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })
        it("withdraws ETH from a single funder", async () => {
            // Arrange
            const startingFundMeBalance =await ethers.provider.getBalance(fundMe.target)
            const startingDeployerBalance =await ethers.provider.getBalance(deployer)

            // Act
            // const transactionResponse = await fundMe.withdraw()
            const gasCost = async (txHash, toNative = true) => {
                const transactionResponse = await fundMe.cheaperWithdraw()
                const transactionReceipt = await transactionResponse.wait(1)
                const { gasUsed, effectiveGasPrice } = await transactionReceipt(
                    [txHash]
                )

                const gasCost = BigInt(gasUsed) * BigInt(effectiveGasPrice)
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.target
            )
            const endingDeployerBalance =await fundMe.provider.getBalance(deployer)

            // Assert
            // Maybe clean up to understand the testing
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance
                    .add(startingDeployerBalance)
                    .toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        }})
        // this test is overloaded. Ideally we'd split it into multiple tests
        // but for simplicity we left it as one



        it("is allows us to withdraw with multiple funders", async () => {
            // Arrange
            const accounts = await ethers.getSigners()
            for (i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }
             const startingFundMeBalance =await ethers.provider.getBalance(fundMe.target)
            const startingDeployerBalance =await ethers.provider.getBalance(deployer)

            // Act
            const transactionResponse = await fundMe.cheaperWithdraw()
            // Let's comapre gas costs :)
            // const transactionResponse = await fundMe.withdraw()
            const gasCost = async (txHash, toNative = true) => {
                const transactionResponse = await fundMe.cheaperwithdraw()
                const transactionReceipt = await transactionResponse.wait(1)
                const { gasUsed, effectiveGasPrice } = await transactionReceipt(
                    [txHash]
                )
            console.log(`GasCost: ${withdrawGasCost}`)
            console.log(`GasUsed: ${gasUsed}`)
            console.log(`GasPrice: ${effectiveGasPrice}`)
            const gasCost = BigInt(gasUsed) * BigInt(effectiveGasPrice)
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.target
            )
            const endingDeployerBalance =await fundMe.provider.getBalance(deployer)

            // Assert
            // Maybe clean up to understand the testing
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance
                    .add(startingDeployerBalance)
                    .toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
            // Make a getter for storage variables
            await expect(fundMe.getFunder(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.getAddressToAmountFunded(
                        accounts[i].address
                    ),
                    0
                )
            }
        }})
        it("Only allows the owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            const attacker=accounts[1]
            const fundMeConnectedContract = await fundMe.connect(
                attacker
            )
            await expect(
                fundMeConnectedContract.withdraw()
            ).to.be.revertedWithCustomError(
                fundMeConnectedContract,
                "FundMe__NotOwner"
            )
        })
        })





    })

    
