var Contract = artifacts.require('./EtherSwap.sol')

var sha256 = require('js-sha256');
var Web3 = require('web3')
var web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545/');

contract('EtherSwap', (accounts) => {

  var address = accounts[0]
  var instance;
  var alice = accounts[0];
  var bob = accounts[1];

  it('deploy', async function() {
    instance = await Contract.deployed();
  });

  var msg = "0x001234"
  encMsg = web3.eth.abi.encodeParameters(
      ['bytes32'],[msg]);
  var hash = web3.utils.soliditySha3(encMsg);

  it('secretLock', async function() {
    var result1 = await instance.secretLock(3600, hash, bob, {value: 1000000, from: alice});
    assert.equal(result1.logs[0].event, "SwapInitiatedEvent");
    assert.equal(result1.logs[0].args.hash, hash);
  });

  it('secretProof', async function() {
    var balanceBob = await web3.eth.getBalance(bob);
    var result2 = await instance.secretProof(msg, {from: alice});
    assert.equal(result2.logs[0].event, "SwapSuccessEvent");
    assert.equal(result2.logs[0].args.hash, hash);

    var balanceBob2 = await web3.eth.getBalance(bob);
    assert.equal(balanceBob, (balanceBob2 - 1000000));
  });
})