import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import UploadMeme from "./components/UploadMeme";
import MemeFeed from "./components/MemeFeed";
import TransferMeme from "./components/TransferMeme";
import "./App.css";

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [memes, setMemes] = useState([]);
  const [tab, setTab] = useState("feed");

  const handleConnect = (address) => setWallet(address);
  const handleUploaded = () => setRefresh((r) => r + 1);
  const handleTransferred = () => setRefresh((r) => r + 1);

  const shortAddress = wallet
    ? wallet.slice(0, 6) + "…" + wallet.slice(-4)
    : null;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo-block">
            <span className="logo-icon">🐸</span>
            <div>
              <h1 className="logo-title">MemeChain</h1>
              <p className="tagline">
                Decentralised meme sharing · powered by blockchain
              </p>
            </div>
          </div>
          <div className="header-right">
            {wallet ? (
              <div className="wallet-badge">
                <span className="wallet-dot" />
                {shortAddress}
              </div>
            ) : (
              <ConnectWallet onConnect={handleConnect} />
            )}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      {wallet && (
        <nav className="tabs">
          <button
            className={`tab ${tab === "feed" ? "active" : ""}`}
            onClick={() => setTab("feed")}
          >
            <span className="tab-icon">◫</span> Feed
          </button>
          <button
            className={`tab ${tab === "upload" ? "active" : ""}`}
            onClick={() => setTab("upload")}
          >
            <span className="tab-icon">⬆</span> Upload
          </button>
          <button
            className={`tab ${tab === "transfer" ? "active" : ""}`}
            onClick={() => setTab("transfer")}
          >
            <span className="tab-icon">⇄</span> Transfer
          </button>
        </nav>
      )}

      {/* Tab Content */}
      <main className="main-content">
        {tab === "feed" && (
          <MemeFeed
            wallet={wallet}
            refresh={refresh}
            onMemesLoaded={setMemes}
          />
        )}

        {tab === "upload" && wallet && (
          <UploadMeme
            wallet={wallet}
            onUploaded={() => {
              handleUploaded();
              setTab("feed");
            }}
          />
        )}

        {tab === "transfer" && wallet && (
          <TransferMeme
            wallet={wallet}
            memes={memes}
            onTransferred={() => {
              handleTransferred();
              setTab("feed");
            }}
          />
        )}

        {!wallet && (
          <div className="no-wallet">
            <p className="no-wallet-icon">🔒</p>
            <p className="no-wallet-text">
              Connect your MetaMask wallet to upload and share memes
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
