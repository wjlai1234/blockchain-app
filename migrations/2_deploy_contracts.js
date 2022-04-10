const Swap = artifacts.require("EthSwap");
const Amm = artifacts.require("AMM");
const CAYTOKEN = artifacts.require("CAYTOKEN");
const KENTOKEN = artifacts.require("KENTOKEN");

module.exports = async function (deployer) {
  // Deploy Token CAY
  await deployer.deploy(CAYTOKEN);
  const CAYToken = await CAYTOKEN.deployed()

  // Deploy Token KEN
  await deployer.deploy(KENTOKEN);
  const KENToken = await KENTOKEN.deployed()

  // Deploy EthSwap
  await deployer.deploy(Swap, CAYTOKEN.address, KENTOKEN.address);
  const swap = await Swap.deployed()

  // Transfer all tokens to EthSwap (1 million)
  await CAYToken.transfer(swap.address, '10000000000000000000000000')
  await KENToken.transfer(swap.address, '10000000000000000000000000')

  // Deploy AMM
   await deployer.deploy(Amm, CAYTOKEN.address, KENTOKEN.address);
   const amm = await Amm.deployed()


};
