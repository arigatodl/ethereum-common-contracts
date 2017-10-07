pragma solidity ^0.4.13;

contract Owned {
    address public owner;

    event LogOwnerSet(address indexed previousOwner, address indexed newOwner);

    function Owned() {
        owner = msg.sender;
    }

    function setOwner(address newOwner)
        public
        fromOwner
        returns(bool success)
    {
        require(owner != newOwner);
        require(newOwner != address(0));

        LogOwnerSet(owner, newOwner);
        owner = newOwner;

        return true;
    }

    modifier fromOwner() {
        require(msg.sender == owner);
        _;
    }
}
