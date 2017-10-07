var Owned: artifacts.require("../contracts/Owned.sol");

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
            .then(instance => owned = instance;)
    });

    it('should have correct initial owner', function() {
        return owned.owner({from: owner})
            .then(owner_ => {
                assert.isEqual(owner, owner_);
                return owned.owner({from: other}); // accessible from non-owner account
            })
            .then(owner_ => {
                assert.isEqual(owner, owner_);
            })
    });

    it('should change owner after setOwner',  function() {
        return owned.setOwner.call(owner1, {from: owner})
            .then(success => {
                assert.isTrue(success);
                return owned.setOwner(owner1, {from: owner});
            })
            .then(txn => {
                assert.strictEqual(tx.receipt.logs.length, 1);
                assert.strictEqual(tx.logs.length, 1);
                const logChanged = tx.logs[0];
                assert.strictEqual(logChanged.event, "LogOwnerSet");
                assert.strictEqual(logChanged.args.previousOwner, owner);
                assert.strictEqual(logChanged.args.newOwner, other);
                return owned.owner();
            })
            .then(owner_ => assert.isEqual(owner_, other));
    });

    it('should prevent non-owners from changing owner', function() {
        const owner_ = await owned.owner.call();
        assert.isTrue(owner !== other);
        try {
            await owned.setOwner(other, {from: other});
            assert.fail('should have thrown before');
        } catch(error) {
            assertJump(error);
        }
    });
});
