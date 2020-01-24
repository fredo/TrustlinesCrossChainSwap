import Web3 from 'web3'


export function getWeb3Provider(){
    const web3 = new Web3(window.ethereum);
    window.ethereum.enable()
    return web3
}
