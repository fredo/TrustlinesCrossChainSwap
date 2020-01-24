import React,{useEffect, useState} from 'react';

import logo from './unicorn.png';
import './App.css';
import { getWeb3Provider } from './services/ethereum-service';

function App() {
  const [web3, setWeb3] = useState()
  const [address, setAddress] = useState()
  useEffect(() => {
    async function printAddress(web3){
      const accounts = await web3.eth.getAccounts()
      setAddress(accounts[0])
      console.log(accounts[0])
    }
    const web3Provider = getWeb3Provider()
    setWeb3(web3Provider)
    printAddress(web3Provider)
    
  }, [])
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href={`https://etherscan.io/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          My address is: {address}
        </a>
      </header>
    </div>
  );
}

export default App;
