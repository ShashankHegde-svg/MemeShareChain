import { useState } from "react";

export default function ConnectWallet({ onConnect }) {
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed!");
      return;
    }
    setLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      onConnect(accounts[0]);
    } catch (err) {
      console.error("Connection rejected", err);
    }
    setLoading(false);
  };

  return (
    <button onClick={connectWallet} disabled={loading} className="connect-btn">
      {loading ? "Connecting..." : "🦊 Connect MetaMask"}
    </button>
  );
}