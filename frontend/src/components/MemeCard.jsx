import { useState } from "react";
import { getContract } from "../utils/contract";
import { ipfsToUrl } from "../utils/ipfs";

export default function MemeCard({ meme, wallet, onLiked, viewMode = "grid" }) {
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (!wallet) {
      alert("Connect wallet first!");
      return;
    }
    setLiking(true);
    try {
      const contract = await getContract();
      const tx = await contract.likeMeme(meme.tokenId);
      await tx.wait();
      onLiked();
    } catch (err) {
      alert("Error: " + (err.reason || err.message));
    }
    setLiking(false);
  };

  const shortAddress = (addr) =>
    addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";

  // Convert blockchain timestamp (seconds) to readable date/time
  const formatTimestamp = (ts) => {
    if (!ts) return "Unknown";
    const date = new Date(Number(ts) * 1000);
    const dateStr = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { dateStr, timeStr };
  };

  const ts = formatTimestamp(meme.timestamp);

  if (viewMode === "list") {
    return (
      <div className="meme-card-list">
        {meme.isDuplicate && (
          <span className="duplicate-badge-list">⚠ Copy</span>
        )}
        <img
          src={ipfsToUrl(meme.ipfsCID)}
          alt={meme.title}
          className="meme-img-list"
        />
        <div className="meme-info-list">
          <div className="meme-list-top">
            <h3 className="meme-title-list">{meme.title}</h3>
            <span className="nft-badge">NFT #{meme.tokenId.toString()}</span>
          </div>
          <p className="creator">
            <span className="creator-icon">◈</span>
            <span>{shortAddress(meme.creator)}</span>
          </p>
          <div className="timestamp-row">
            <span className="ts-icon">◷</span>
            <span className="ts-date">{ts.dateStr}</span>
            <span className="ts-sep">·</span>
            <span className="ts-time">{ts.timeStr}</span>
          </div>
        </div>
        <div className="meme-actions-list">
          <button onClick={handleLike} disabled={liking} className="like-btn">
            {liking ? "..." : `♥ ${meme.likes.toString()}`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="meme-card">
      {meme.isDuplicate && (
        <div className="duplicate-badge">⚠ Copy Detected</div>
      )}
      <div className="meme-img-wrapper">
        <img
          src={ipfsToUrl(meme.ipfsCID)}
          alt={meme.title}
          className="meme-img"
        />
        <div className="meme-timestamp-overlay">
          <span className="ts-icon">◷</span>
          <span>
            {ts.dateStr} · {ts.timeStr}
          </span>
        </div>
      </div>
      <div className="meme-info">
        <div className="meme-card-top">
          <h3>{meme.title}</h3>
          <span className="nft-badge">#{meme.tokenId.toString()}</span>
        </div>
        <p className="creator">
          <span className="creator-icon">◈</span>
          <span>{shortAddress(meme.creator)}</span>
        </p>
        <div className="meme-actions">
          <button onClick={handleLike} disabled={liking} className="like-btn">
            {liking ? "Liking..." : `♥ ${meme.likes.toString()} Likes`}
          </button>
        </div>
      </div>
    </div>
  );
}
