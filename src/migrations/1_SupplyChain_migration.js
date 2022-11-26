const sc = artifacts.require("SupplyChain");
module.exports = function (deployer) {
  deployer.deploy(sc);
};