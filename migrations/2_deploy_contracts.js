var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var RoleHilti = artifacts.require("./RoleHilti.sol");
var HiltiToken = artifacts.require("./HiltiToken.sol");
var HiltiContract = artifacts.require("./HiltiContract.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(RoleHilti);
  deployer.deploy(HiltiToken);
  deployer.deploy(HiltiContract);
};
