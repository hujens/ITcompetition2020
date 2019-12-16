var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var HiltiToken = artifacts.require("./HiltiToken.sol");
var HiltiRole = artifacts.require("./HiltiRole.sol");
var HiltiContract = artifacts.require("./HiltiContract.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(HiltiRole);
  deployer.deploy(HiltiToken);
  deployer.deploy(HiltiContract);
};
