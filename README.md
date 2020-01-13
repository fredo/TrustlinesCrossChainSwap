TrustlinesCrossChainSwap (TC2S)

Atomic Swaps between the Trustlines Blockchain and Ethereum Main Chain




#Smart Contracts

Smart Contracts are inherited from the project https://github.com/kabl/ether-cross-chain-swap

## How it works

Lets say Alice wants to convert Ether to NEM:XEM and Bob NEM:XEM to Ether. 

Hint: The wording in this Ethereum smart contract is a bit different as in the NEM documentation. In my opinion NEM naming is confusing. Especial in NEM `secret` represents a `hash` and is not the real secret. 

Steps:
- Both agree on an exchange rate.
- Both exchange their addresses to receive the funds.
- Alice creates a `secret` and the `hash` of it. 
- Alice writes to the Ethereum smart contract `secretLock(uint256 _lockTimeSec, bytes32 _hash, address _recipient)` and adds the agreed amount of Ether. 
- Alice submits the `hash` to Bob. 
- Bob is now able to validate/audit the 'secret lock' in the Ethereum smart contract. 
- Bob will now create a 'secret lock transaction' in NEM `SecretLockTransaction.create(Deadline.create(),
    new Mosaic(new MosaicId('nem:xem'), exchangeValue),
    lockTime,
    HashType.SHA256,
    secret,
    Alice.address,
    NetworkType.MIJIN);`.
- Alice gets notified and can validate/audit the NEM secret lock. 
- Alice will then call on the NEM network a 'secret proof transaction'. `SecretProofTransaction.create(
    Deadline.create(),
    HashType.SHA256,
    hash,
    proof,
    NetworkType.MAIN_NET);`.
- So Alice will get the XEM:NEM and for her the swap was successful. 
- Bob gets notified by the NEMs secret proof transaction. As it is a public blockchain, Bob sees the `proof` the real secret. 
- Bob then creates an Ethereum transaction to the smart contract. `secretProof(bytes32 _hash, bytes _proof)`. So Bob will receive the Ether. 


## Notes
Web3 version 1.x is installed with NPM. Also Truffle comes with Web3 0.2x. The API of these Web3 are not always compatible. 
- [Web3 version 1.x](https://github.com/ethereum/wiki/wiki/JavaScript-API)
- [Web3 version 0.2x.x](https://github.com/ethereum/wiki/wiki/JavaScript-API#web3-javascript-app-api-for-02xx)
