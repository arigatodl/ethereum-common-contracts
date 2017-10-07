var Owned = artifacts.require("../contracts/Owned.sol");

contract('Owned', function(accounts) {
    let owned;
    var owner, other;

    before("should prepare accounts", function() {
        assert.isAtLeast(accounts.length, 2);
        owner = accounts[0];
        other = accounts[1];
    });

    beforeEach("should deploy a new contract", function() {
        return Owned.new({from: owner})
            .then(instance => owned = instance);
    });

    it('should have correct initial owner', function() {
        return owned.owner({from: owner})
            .then(owner_ => {
                assert.equal(owner, owner_);
                return owned.owner({from: other}); // accessible from non-owner account
            })
            .then(owner_ => {
                assert.equal(owner, owner_);
            });
    });

    it('should change owner after setOwner',  function() {
        return owned.setOwner.call(other, {from: owner})
            .then(success => {
                assert.isTrue(success);
                return owned.setOwner(other, {from: owner});
            })
            .then(txn => {
                assert.strictEqual(txn.receipt.logs.length, 1);
                assert.strictEqual(txn.logs.length, 1);
                const logChanged = txn.logs[0];
                assert.strictEqual(logChanged.event, "LogOwnerSet");
                assert.strictEqual(logChanged.args.previousOwner, owner);
                assert.strictEqual(logChanged.args.newOwner, other);
                return owned.owner();
            })
            .then(owner_ => assert.equal(owner_, other));
    });

    it('should prevent non-owners from changing owner', async function() {
        const owner_ = await owned.owner.call();
        assert.isTrue(owner !== other);
        try {
            await owned.setOwner(other, {from: other});
            assert.fail('should have thrown before');
        } catch(error) {
            console.log(error);
        }
    });
});
