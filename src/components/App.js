import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import ConnectButton from './ConnectButton.js';
import Navbar from './4_NavBar.js';
import PitchSummary from './1_PitchSummary.js';
import PitchPage from './2_PitchPage.js';
import GovernanceGuide from './3_GovernanceGuide.js';
import Auction from './Auction.js';
import Token from '../abis/Token.json';
import SMTFaucet from '../abis/SMTFaucet.json';
import {ethers} from 'ethers';

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    if (window.ethereum) {
      const web3 = new Web3(window.web3.currentProvider);
      //Load account
      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })
      console.log(this.state.account)
      const networkId = await web3.eth.net.getId()
      const networkData = SMTFaucet.networks[networkId]
      if(networkData) {
        const smtfaucet = new web3.eth.Contract(SMTFaucet.abi, networkData.address)
        this.setState({ smtfaucet })
      }
    } else {
      window.alert("not connected")
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      tokenBalance: '0'
    }
  }

  getVote = () => {
    this.state.smtfaucet.methods.send().send({ from: this.state.account });
  }

  render() {
    return (
      <div>
        <Navbar />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                  <img src={logo} style={{ width: '50%' }} className="App-logo" alt="logo" />
                <h1>OBG DAO Starter Kit</h1>
                <h2>{ ethers.utils.formatEther(this.state.tokenBalance) }</h2>
                <div className='connectbutton'>
                  <ConnectButton tokenBalance={this.state.tokenBalance} />
                </div>
                <div className='pitchsumwidget'>
                  <PitchSummary account={this.state.account} tokenBalance={this.state.tokenBalance} />
                </div>
                <div className='pitchpagewidget'>
                  <PitchPage />
                </div>
                <div className='govguidewidget'>
                  <GovernanceGuide />
                </div>
                <div className='auctionwidget'>
                  <Auction />
                  <button onClick={(event) => {
                    this.getVote()
                  }}>Hello</button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
