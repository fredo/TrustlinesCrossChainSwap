pragma solidity ^0.5.12;


contract EtherSwap {

    struct Swap {
        address payable inititator;
        uint64 endTimeStamp;
        address payable recipient;
        uint256 value;
    }

    mapping(bytes32 => Swap) public swapMap; // the key is the hash

    event SwapInitiatedEvent(bytes32 indexed hash, uint256 value);
    event SwapSuccessEvent(bytes32 indexed hash, uint256 value);
    event SwapExpiredEvent(bytes32 indexed hash);

    function secretLock(uint64 _lockTimeSec, bytes32 _hash, address payable _recipient) external payable {
        require(swapMap[_hash].inititator == address(0x0), "Entry already exists");
        require(msg.value > 0, "Ether is required");

        swapMap[_hash].inititator = msg.sender;
        swapMap[_hash].recipient = _recipient;
        swapMap[_hash].endTimeStamp = uint64(now + _lockTimeSec);
        swapMap[_hash].value = msg.value;

        emit SwapInitiatedEvent(_hash, msg.value);
    }

    function secretProof(bytes calldata _proof) external {
        bytes32 hash = sha256(_proof);
        require(swapMap[hash].inititator != address(0x0), "No entry found"); 
        require(swapMap[hash].endTimeStamp >= now, "TimeStamp violation");

        uint256 value = swapMap[hash].value;
        address payable recipient = swapMap[hash].recipient;
    
        clean(hash);
        recipient.transfer(value);
        emit SwapSuccessEvent(hash, value);
    }

    function swapExpiredRefund(bytes32 _hash) external {
        require(swapMap[_hash].inititator != address(0x0), "No entry found");
        require(swapMap[_hash].endTimeStamp < now, "TimeStamp violation");

        uint256 value = swapMap[_hash].value;
        address payable initiator = swapMap[_hash].inititator;
        clean(_hash);
        
        initiator.transfer(value);
        emit SwapExpiredEvent(_hash);
    }

    function clean(bytes32 _hash) private {
        Swap storage swap = swapMap[_hash];
        delete swap.inititator;
        delete swap.recipient;
        delete swap.endTimeStamp;
        delete swap.value;
        delete swapMap[_hash];
    }
}