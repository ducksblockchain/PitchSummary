const SMTFaucet = artifacts.require("SMTFaucet");

module.exports = function(deployer) {
  deployer.deploy(SMTFaucet);
};
