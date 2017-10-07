pragma solidity ^0.4.13;

import "./Owned.sol";

contract Pausable is Owned {
    bool public paused;

    event LogPause(address indexed sender);
    event LogUnpause(address indexed sender);

    function Pausable(bool state) {
        paused = state;
    }

    function pause()
        public
        fromOwner
        whenNotPaused
    {
        paused = true;
        LogPause(msg.sender);
    }

    function unpause()
        public
        fromOwner
        whenPaused
    {
        paused = false;
        LogUnpause(msg.sender);
    }

     modifier whenPaused() {
         require(paused);
         _;
     }

     modifier whenNotPaused() {
         require(!paused);
         _;
     }
}
