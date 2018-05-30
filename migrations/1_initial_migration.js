var Migrations = artifacts.require("./Migrations.sol");
var registrar = artifacts.require("Registrar");
module.exports = function(deployer, network, accounts) {
    if (network == "development") {
        deployer.deploy(Migrations);
        deployer.deploy(registrar, [accounts[0], accounts[1]]);
    }
};
