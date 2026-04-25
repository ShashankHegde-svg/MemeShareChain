import { useState } from "react";
import { getContract } from "../utils/contract";

export default function TransferMeme({ wallet, memes, onTransferred }) {
  const [tokenId, setTokenId] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Only show memes owned by current wallet
  const myMemes = memes.filter(
    (m) => m.creator.toLowerCase() === wallet?.toLowerCase(),
  );

  const handleTransfer = async () => {
    if (!tokenId || !toAddress) {
      alert("Please select a meme and enter recipient address!");
      return;
    }
    setLoading(true);
    try {
      setStatus("Confirm transfer in MetaMask...");
      const contract = await getContract();
      const tx = await contract.transferMeme(toAddress, tokenId);

      setStatus("Waiting for confirmation...");
      await tx.wait();

      setStatus("✅ Meme transferred successfully!");
      setTokenId("");
      setToAddress("");
      onTransferred();
    } catch (err) {
      setStatus("❌ Error: " + (err.reason || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="upload-box">
      <h2>🔁 Transfer Meme to Another Wallet</h2>

      {myMemes.length === 0 ? (
        <p style={{ color: "#888" }}>
          You don't own any memes yet. Upload one first!
        </p>
      ) : (
        <>
          {/* Dropdown to pick which meme to transfer */}
          <select
            className="input"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a meme to transfer...</option>
            {myMemes.map((m) => (
              <option key={m.tokenId.toString()} value={m.tokenId.toString()}>
                NFT #{m.tokenId.toString()} — {m.title}
              </option>
            ))}
          </select>

          {/* Recipient wallet address */}
          <input
            type="text"
            className="input"
            placeholder="Recipient wallet address (0x...)"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            disabled={loading}
          />

          {/* Hardhat test accounts for easy demo */}
          <div className="quick-fill">
            <p
              style={{ fontSize: "0.8rem", color: "#888", marginBottom: "6px" }}
            >
              Quick fill test accounts:
            </p>
            <button
              className="quick-btn"
              onClick={() =>
                setToAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
              }
            >
              Account #1
            </button>
            <button
              className="quick-btn"
              onClick={() =>
                setToAddress("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
              }
            >
              Account #2
            </button>
            <button
              className="quick-btn"
              onClick={() =>
                setToAddress("0x90F79bf6EB2c4f870365E785982E1f101E93b906")
              }
            >
              Account #3
            </button>
          </div>

          <button
            onClick={handleTransfer}
            disabled={loading || !tokenId || !toAddress}
            className="upload-btn"
            style={{ marginTop: "12px" }}
          >
            {loading ? status : "🚀 Transfer Meme"}
          </button>

          {status && !loading && <p className="status">{status}</p>}
        </>
      )}
    </div>
  );
}
