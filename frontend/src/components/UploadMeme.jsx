import { useState } from "react";
import { uploadToIPFS, computeImageHash } from "../utils/ipfs";
import { getContract } from "../utils/contract";

export default function UploadMeme({ wallet, onUploaded }) {
  const [file, setFile]       = useState(null);
  const [title, setTitle]     = useState("");
  const [preview, setPreview] = useState(null);
  const [status, setStatus]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setStatus("");
  };

  const handleUpload = async () => {
    if (!file || !title) {
      alert("Please select a file and enter a title!");
      return;
    }
    setLoading(true);
    try {
      setStatus("Computing image hash...");
      const imageHash = await computeImageHash(file);

      setStatus("Checking for duplicates...");
      const contract = await getContract();
      if (!contract) { setLoading(false); return; }

      const isDup = await contract.isHashDuplicate(imageHash);
      if (isDup) {
        setStatus("⚠️ This meme already exists on the blockchain!");
        setLoading(false);
        return;
      }

      setStatus("Uploading to IPFS...");
      const cid = await uploadToIPFS(file);

      setStatus("Confirm transaction in MetaMask...");
      const tx = await contract.uploadMeme(cid, title, imageHash);

      setStatus("Waiting for confirmation...");
      await tx.wait();

      setStatus("✅ Meme uploaded successfully!");
      setFile(null);
      setTitle("");
      setPreview(null);
      onUploaded();

    } catch (err) {
      console.error(err);
      setStatus("❌ Error: " + (err.reason || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="upload-box">
      <h2>Upload a Meme</h2>

      <input
        type="text"
        placeholder="Meme title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
        disabled={loading}
      />

      {!preview ? (
        <label className="file-label">
          📁 Choose Image / Video
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
      ) : (
        <div className="preview-wrapper">
          <img src={preview} alt="Preview" className="preview-img" />
          <div className="preview-meta">
            <span>📄 {file.name}</span>
            <button onClick={handleRemoveFile} className="remove-btn">✕ Remove</button>
          </div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || !wallet || !file}
        className="upload-btn"
        style={{ marginTop: "12px" }}
      >
        {loading ? status : "🚀 Upload Meme"}
      </button>

      {status && !loading && <p className="status">{status}</p>}
    </div>
  );
}