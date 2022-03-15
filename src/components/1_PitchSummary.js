import React from 'react';
import Web3 from 'web3';
import { useState, useEffect } from 'react';
import {ethers} from 'ethers';

const signMessage = async ({ setError, message }) => {
  try {
    console.log({ message });
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();
    console.log(signature);

    return {
      message,
      signature,
      address
    };
  } catch (err) {
    setError(err.message);
  }
};

const PitchSummary = (props) => {
  const [signatures, setSignatures] = useState([]);
  const [error, setError] = useState();
  const [yesVotes, setYesVotes] = useState();

  useEffect(() => {
    if (localStorage.getItem('yes') > 2000000) {
      localStorage.clear();
      localStorage.setItem('yes', 0);
    }
  });

  const handleSign = async () => {
    if (localStorage.getItem(props.account) == null) {
      setError();
      const sig = await signMessage({
        setError,
        message: "you are using your coins to vote"
      });
      if (sig) {
        setSignatures([...signatures, sig]);
        localStorage.setItem('yes', +localStorage.getItem('yes') + +ethers.utils.formatEther(props.tokenBalance))
        localStorage.setItem(props.account, true);
      }
    } else {
      window.alert("You already voted");
    }
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  return(
    <div className="pitchsummary text-center">
      <h2>Pitch summary</h2>
      <button onClick={() => console.log(localStorage.getItem('yes'))}>Hello</button>
      <button onClick={() => {handleSign(props.tokenBalance)}}>Vote yes</button>
      <button onClick={() => localStorage.setItem('yes', +localStorage.getItem('yes') + +ethers.utils.formatEther(props.tokenBalance))}>Bye</button>
      <progress value={+localStorage.getItem('yes')} max={3000000} />
      <h2>vote: {numberWithCommas(+localStorage.getItem('yes'))}/3,000,000</h2>
    </div>
  );
}

export default PitchSummary;
