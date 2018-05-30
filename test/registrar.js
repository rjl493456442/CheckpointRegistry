var registrar = artifacts.require("Registrar");

// Admin management relative unit tests
contract('Registrar', function(accounts) {
    var contract;
    it("Add/Remove admin", function() {
        return registrar.deployed().then(function(instance){
            // Add account[2] to admin list
            // Authorized by accounts[0]
            //
            // Note accounts[0] and accounts[1] are already included.
            contract = instance;
            return contract.AddAdmin(accounts[2], {from: accounts[0]});
        }).then(function() {
            return contract.GetAllAdmin();
        }).then(function(result) {
            assert.deepEqual(result, [accounts[0], accounts[1], accounts[2]], "Admin list should contain 3 accounts");
        }).then(function() {
            // Try to remove an admin by an unauthorized account.
            return contract.RemoveAdmin(accounts[0], {from: accounts[3]});  
        }).catch(function(e) {
            assert.isNotNull(e, "expect an error occur");
        }).then(function() {
            // Try to remove a head admin by an authorized account.
            return contract.RemoveAdmin(accounts[0], {from: accounts[1]});  
        }).then(function(){
            return contract.GetAllAdmin();
        }).then(function(result) {
            assert.deepEqual(result, [accounts[1], accounts[2]], "Admin list contain 2 accounts");
        }).then(function() {
            // Try to remove a tail admin by an authorized account.
            return contract.RemoveAdmin(accounts[2], {from: accounts[1]});  
        }).then(function(){
            return contract.GetAllAdmin();
        }).then(function(result) {
            assert.deepEqual(result, [accounts[1]], "Admin list contain 1 accounts");
        });
    });
});

var checkpoint170 = {
    "sectionIndex":  170,
    "sectionHead":   "0x3bb2c28bcce463d57968f14f56cdb3fbf35349ab7a701f44c1afb57349c9a356",
    "chtRoot":       "0xd92b6d0853455f8439086292338e87f69781921680dd7aa072fb71547b87415e",
    "bloomTrieRoot": "0xe4e8250a2fefddead7ae42daecd848cbf9b66d748a8270f8bbd4370b764bb9e9",
}

var checkpointFake100 = {
    "sectionIndex":  100,
    "sectionHead":   "0x3bb2c28bcce463d57968f14f56cdb3fbf35349ab7a701f44c1afb57349c9a356",
    "chtRoot":       "0xd92b6d0853455f8439086292338e87f69781921680dd7aa072fb71547b87415e",
    "bloomTrieRoot": "0xe4e8250a2fefddead7ae42daecd848cbf9b66d748a8270f8bbd4370b764bb9e9",
}

var checkpointFake171 = {
    "sectionIndex":  171,
    "sectionHead":   "0x3bb2c28bcce463d57968f14f56cdb3fbf35349ab7a701f44c1afb57349c9a356",
    "chtRoot":       "0xd92b6d0853455f8439086292338e87f69781921680dd7aa072fb71547b87415e",
    "bloomTrieRoot": "0xe4e8250a2fefddead7ae42daecd848cbf9b66d748a8270f8bbd4370b764bb9e9",
}

// Checkpoint relative unit tests
contract('Registrar', function(accounts) {
    var contract;
    it("Set/Get Checkpoint", function() {
        return registrar.deployed().then(function(instance){
            contract = instance;
            contract.SetCheckpoint(checkpoint170.sectionIndex, checkpoint170.sectionHead, checkpoint170.chtRoot, checkpoint170.bloomTrieRoot);
        }).then(function() {
            return contract.GetLatestCheckpoint();
        }).then(function(result) {
            assert.equal(result[0].toNumber(), checkpoint170.sectionIndex);
            assert.deepEqual([result[1], result[2], result[3]], [checkpoint170.sectionHead, checkpoint170.chtRoot, checkpoint170.bloomTrieRoot]);
        });
    });
});


// Checkpoint relative unit tests
contract('Registrar', function(accounts) {
    var contract;
    it("Continuous set checkpoint", function() {
        return registrar.deployed().then(function(instance){
            contract = instance;
            contract.SetCheckpoint(checkpoint170.sectionIndex, checkpoint170.sectionHead, checkpoint170.chtRoot, checkpoint170.bloomTrieRoot);
        }).then(function() {
            contract.SetCheckpoint(checkpointFake100.sectionIndex, checkpointFake100.sectionHead, checkpointFake100.chtRoot, checkpointFake100.bloomTrieRoot);
        }).catch(function(e) {
            assert.isNotNull(e, "an error should occur");
        }).then(function() {
            contract.SetCheckpoint(checkpointFake171.sectionIndex, checkpointFake171.sectionHead, checkpointFake171.chtRoot, checkpointFake171.bloomTrieRoot);
        }).then(function() {
            return contract.GetLatestCheckpoint();
        }).then(function(result) {
            assert.equal(result[0].toNumber(), checkpointFake171.sectionIndex);
        });
    });
});
