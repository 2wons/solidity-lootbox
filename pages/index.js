import { useState, useEffect } from "react";
import { ethers } from "ethers";
import lootbox_abi from "../artifacts/contracts/Lootbox.sol/Lootbox.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [lootbox, setLootbox] = useState(undefined);
  const [prizes, setPrizes] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const lootABI = lootbox_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getLootboxContract();
  };

  const getLootboxContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const lootContract = new ethers.Contract(contractAddress, lootABI, signer);

    setLootbox(lootContract);

    lootContract.on("LootboxBought", (buyer, boxType, prize) => {
      alert(`You won a Prize: ${prize}`);
    });
    getRewards();
  };

  const getRewards = async () => {
    if (lootbox) {
      setPrizes(await lootbox.getMyPrizes());
    }
  };

  const buyWood = async () => {
    if (!lootbox) return;

    try {
      const tx = await lootbox.buyWoodBox({
        value: ethers.utils.parseEther("1"),
      });
      await tx.wait();
    } catch (error) {
      console.error("transaaction error", error);
    }

    getRewards();
  };

  const buySilver = async () => {
    if (!lootbox) return;

    const tx = await lootbox.buySilverBox({
      value: ethers.utils.parseEther("2"),
    });
    await tx.wait();

    getRewards();
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this App.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    return (
      <div>
        <p>Your Account: {`...${account.toString().slice(-4)}`}</p>
        {account ? (
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <button onClick={buyWood}>Buy Wood Loot</button>
            <button onClick={buySilver}> Buy Silver Loot</button>
          </div>
        ) : (
          <p>Please Connect Account.</p>
        )}
        <hr />
        <h2> Your Prizes </h2>
        <ul>
          {prizes.map((prize, index) => (
            <li key={index}>{prize}</li>
          ))}
        </ul>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to Meta Gacha!</h1>
      </header>
      {initUser()}
      <style jsx>
        {`
          .container {
            text-align: center;
            font-family: Arial;
          }
          body {
            font-family: Arial;
          }
        `}
      </style>
    </main>
  );
}
