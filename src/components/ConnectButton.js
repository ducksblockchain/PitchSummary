import React, {useState} from 'react';
import Web3 from 'web3';
import {ethers} from 'ethers';

const ConnectButton = () => {

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState(null);

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum.request({method: 'eth_requestAccounts'})
      .then(result => {
        accountChangeHandler(result[0]);
      })
    } else {
      setErrorMessage('Install MetaMask');
    }
  }

  const accountChangeHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getUserBalance(newAccount);
  }

  const getUserBalance = (address) => {
    window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest']})
    .then(balance => {
        setUserBalance(ethers.utils.formatEther(balance));
        console.log(balance);
    })
  }

  const enableEthereum = () => {
    window.ethereum.request({ method: 'eth_requestAccount' })
  }

  return (
    <div className='connectButton'>
        <div className='accountDisplay'>
          <h3>Address: {defaultAccount}</h3>
        </div>
        <div className='balanceDisplay'>
          <h3>Balance: {userBalance}</h3>
        </div>
          <button onClick={connectWalletHandler}>Connect Wallet</button>
    </div>
  )
}

export default ConnectButton;
