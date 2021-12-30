const OBGGovernance = artifacts.require("OBGGovernance");

module.exports = function(deployer) {
  deployer.deploy(OBGGovernance);
};
