const Token = artifacts.require("Token");
const Swap = artifacts.require("Swap");
const Amm = artifacts.require("AMM");

module.exports = async function (deployer) {
  // Deploy Token Cayden
  await deployer.deploy(Token);
  const token = await Token.deployed()

  // Deploy EthSwap
  await deployer.deploy(Swap, token.address);
  const swap = await Swap.deployed()

  // Transfer all tokens to EthSwap (1 million)
  await token.transfer(swap.address, '1000000000000000000000000')

  // Deploy AMM
  await deployer.deploy(Amm, token.address);
  const amm = await Amm.deployed()

};
