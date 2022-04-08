const Token = artifacts.require("NDCoinERC20");

module.exports = function (deployer) {
  deployer.deploy(Token,1000000000000);
};
