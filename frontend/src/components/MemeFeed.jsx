import { useEffect, useState } from "react";
import { getReadOnlyContract } from "../utils/contract";
import MemeCard from "./MemeCard";

export default function MemeFeed({ wallet, refresh, onMemesLoaded }) {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  const loadMemes = async () => {
    setLoading(true);
    try {
      const contract = await getReadOnlyContract();
      const allMemes = await contract.getAllMemes();
      const reversed = [...allMemes].reverse();
      setMemes(reversed);
      if (onMemesLoaded) onMemesLoaded(reversed);
    } catch (err) {
      console.error("Error loading memes:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMemes();
  }, [refresh]);

  if (loading) return <p className="loading">Loading memes from blockchain…</p>;
  if (memes.length === 0)
    return <p className="loading">No memes yet — be the first to upload!</p>;

  return (
    <div>
      {/* Feed toolbar */}
      <div className="feed-toolbar">
        <div className="feed-count">
          <span className="feed-count-num">{memes.length}</span>
          <span className="feed-count-label">memes on-chain</span>
        </div>
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            ⊞ Grid
          </button>
          <button
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            ≡ List
          </button>
        </div>
      </div>

      {/* Meme feed */}
      <div className={viewMode === "grid" ? "meme-feed" : "meme-feed-list"}>
        {memes.map((meme) => (
          <MemeCard
            key={meme.tokenId.toString()}
            meme={meme}
            wallet={wallet}
            onLiked={loadMemes}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}
