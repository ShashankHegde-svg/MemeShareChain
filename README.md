# 🐸 MemeChain — Decentralized Meme Sharing Platform

> A blockchain-based platform where every meme is an NFT. Upload, own, transfer, and like memes — all on-chain, no central server, no censorship.

![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat&logo=solidity)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react)
![Hardhat](https://img.shields.io/badge/Hardhat-2.22.0-F7DF1E?style=flat)
![Ethers](https://img.shields.io/badge/Ethers.js-5.7.2-764ABC?style=flat)
![IPFS](https://img.shields.io/badge/IPFS-Pinata-65C2CB?style=flat)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Smart Contract](#-smart-contract)
- [Demo Flow](#-demo-flow)
- [Environment Variables](#-environment-variables)
- [Known Issues](#-known-issues)
- [Future Work](#-future-work)
- [License](#-license)

---

## 📖 About the Project

**MemeChain** is a fully decentralized meme sharing platform built as a Blockchain subject project. It demonstrates core blockchain concepts including:

- **Decentralized storage** — Meme images are stored on IPFS (not on any central server)
- **Smart contracts** — All logic (upload, like, transfer) runs on-chain via Solidity
- **NFT ownership** — Every meme is minted as an ERC-721 NFT assigned to the uploader's wallet
- **Wallet authentication** — No username/password — users log in via MetaMask
- **Anti-copy system** — SHA-256 image hash checked on-chain to detect duplicate uploads
- **On-chain transfer** — Meme NFTs can be sent from one wallet to another permanently

---

## ✅ Features

| Feature | Description |
|---|---|
| 🦊 Wallet Login | Connect MetaMask — no username or password needed |
| 📤 Upload Meme | Image uploaded to IPFS, metadata stored on blockchain |
| 🎨 NFT Minting | Every meme auto-minted as ERC-721 NFT on upload |
| 🔍 Duplicate Detection | SHA-256 hash checked on-chain before minting |
| 📋 Meme Feed | Browse all memes in grid or list view |
| 🕐 Timestamps | Block timestamp shown on every meme card |
| ❤️ Like System | On-chain likes — 1 per wallet, no self-liking |
| 🔁 Transfer Meme | Send NFT ownership from one wallet to another |
| 🔄 Auto Account Switch | Feed auto-refreshes when MetaMask account changes |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Smart Contract | Solidity 0.8.20 + OpenZeppelin ERC-721 |
| Development | Hardhat 2.22.0 |
| Blockchain Network | Hardhat Local (Chain ID 31337) / Polygon Amoy Testnet |
| Frontend | React + Vite |
| Web3 Library | Ethers.js v5.7.2 |
| Decentralized Storage | IPFS via Pinata |
| Wallet | MetaMask |

---

## 🏗 Architecture

```
User Browser (React Frontend)
        │
        ├── MetaMask (Wallet / Identity)
        │       └── Signs transactions
        │
        ├── Ethers.js v5
        │       └── Talks to smart contract
        │
        ├── Pinata API
        │       └── Uploads image to IPFS
        │       └── Returns CID (content hash)
        │
        └── MemePlatform.sol (Smart Contract)
                ├── Stores: CID, title, creator, likes, timestamp, imageHash
                ├── Mints ERC-721 NFT on upload
                ├── Checks duplicate via imageHash mapping
                ├── Enforces 1-like-per-wallet rule
                └── Handles NFT ownership transfer
```

**Key design decision:** Images are too large to store on-chain. Only the IPFS CID (a small hash string) is stored in the smart contract. The actual image is fetched from IPFS via the gateway.

---

## 📁 Project Structure

```
MemeShareChain/
└── meme_pltm/
    ├── contracts/
    │   └── MemePlatform.sol          # ERC-721 smart contract
    ├── scripts/
    │   └── deploy.js                 # Deployment script
    ├── test/                         # Contract tests
    ├── frontend/
    │   ├── public/
    │   └── src/
    │       ├── App.jsx               # Main app + tab navigation
    │       ├── App.css               # Global styles
    │       ├── components/
    │       │   ├── ConnectWallet.jsx # MetaMask connection
    │       │   ├── UploadMeme.jsx    # Upload flow (hash → IPFS → chain)
    │       │   ├── MemeFeed.jsx      # Grid + list view of all memes
    │       │   ├── MemeCard.jsx      # Single meme card with timestamp
    │       │   └── TransferMeme.jsx  # NFT transfer between wallets
    │       └── utils/
    │           ├── contract.js       # ABI + ethers.js contract helpers
    │           └── ipfs.js           # Pinata upload + SHA-256 hash
    ├── hardhat.config.js             # Hardhat network config
    ├── .env                          # Secret keys (not committed)
    ├── .gitignore
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org) v18 or above
- [MetaMask](https://metamask.io) browser extension (Chrome recommended)
- [Git](https://git-scm.com)
- A free [Pinata](https://pinata.cloud) account (for IPFS)
- A free [Alchemy](https://alchemy.com) account (for testnet RPC)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/MemeShareChain.git
cd MemeShareChain/meme_pltm
```

---

### 2. Install Dependencies

```bash
# Install smart contract dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

### 3. Create the `.env` File

Create a file named `.env` inside the `meme_pltm/` folder:

```env
ALCHEMY_AMOY_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_metamask_wallet_private_key
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET=your_pinata_secret_key
```

> ⚠️ Never commit `.env` to GitHub. It is already listed in `.gitignore`.

---

### 4. Configure MetaMask

Add the Hardhat Local network to MetaMask:

| Field | Value |
|---|---|
| Network Name | `Hardhat Local` |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency Symbol | `ETH` |

Import a test account into MetaMask using this private key:

```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

> This is Hardhat's default Account #0 with 10,000 test ETH. Safe to use for local development only.

---

### 5. Start the Local Blockchain

Open **Terminal 1** and run:

```bash
cd meme_pltm
npx hardhat node
```

Leave this running. You will see 20 test accounts printed with 10,000 ETH each.

---

### 6. Deploy the Smart Contract

Open **Terminal 2** and run:

```bash
cd meme_pltm

# Windows
set NODE_OPTIONS=--max-old-space-size=4096
npx hardhat run scripts/deploy.js --network localhost

# Mac / Linux
NODE_OPTIONS=--max-old-space-size=4096 npx hardhat run scripts/deploy.js --network localhost
```

You will see output like:

```
Deploying MemePlatform contract...
MemePlatform deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Copy the deployed address and paste it into `frontend/src/utils/contract.js`:

```javascript
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
```

---

### 7. Start the Frontend

Open **Terminal 3** and run:

```bash
cd meme_pltm/frontend
npm run dev
```

Open Chrome and navigate to:

```
http://localhost:5173
```

---

### 8. Connect and Use

1. Make sure MetaMask is set to **Hardhat Local** network
2. Select the **Imported Account** (10,000 ETH)
3. Click **Connect MetaMask** in the app
4. Start uploading, liking, and transferring memes!

---

## 📄 Smart Contract

**Contract:** `MemePlatform.sol`  
**Standard:** ERC-721 (OpenZeppelin)  
**Network:** Hardhat Local / Polygon Amoy Testnet

### Functions

```solidity
// Upload a meme — mints NFT, stores on-chain metadata
function uploadMeme(string _ipfsCID, string _title, bytes32 _imageHash) public

// Like a meme — 1 per wallet, cannot like own meme
function likeMeme(uint256 _tokenId) public

// Transfer NFT ownership to another wallet
function transferMeme(address _to, uint256 _tokenId) public

// Check if image hash already exists (duplicate detection)
function isHashDuplicate(bytes32 _imageHash) public view returns (bool)

// Get all memes (used for the feed)
function getAllMemes() public view returns (Meme[])

// Get single meme by token ID
function getMeme(uint256 _tokenId) public view returns (Meme)
```

### Meme Data Structure

```solidity
struct Meme {
    uint256 tokenId;      // NFT ID
    string  ipfsCID;      // IPFS content hash of the image
    string  title;        // Meme title
    address creator;      // Uploader's wallet address
    uint256 likes;        // Total like count
    uint256 timestamp;    // Block timestamp of upload
    bool    isDuplicate;  // True if image was uploaded before
    bytes32 imageHash;    // SHA-256 hash of image file
}
```

---

## 🎬 Demo Flow

Follow this flow to demonstrate all features:

```
1. Connect MetaMask (Account A)
        ↓
2. Upload a meme → MetaMask confirms → NFT #1 minted
        ↓
3. View meme in feed → see timestamp, creator address, NFT ID
        ↓
4. Transfer tab → select NFT #1 → enter Account B address → Confirm
        ↓
5. Switch MetaMask to Account B
        ↓
6. Feed auto-refreshes → meme now shows Account B as creator
        ↓
7. Like the meme from Account B → like count increases on-chain
```

---

## 🔑 Environment Variables

| Variable | Description | Where to get it |
|---|---|---|
| `ALCHEMY_AMOY_URL` | Polygon Amoy RPC endpoint | [alchemy.com](https://alchemy.com) |
| `PRIVATE_KEY` | MetaMask wallet private key | MetaMask → Account Details → Export Private Key |
| `PINATA_API_KEY` | Pinata API key for IPFS uploads | [pinata.cloud](https://pinata.cloud) → API Keys |
| `PINATA_SECRET` | Pinata secret key | Same as above |

---

## ⚠️ Known Issues

| Issue | Fix |
|---|---|
| Out of memory on deploy | Add `set NODE_OPTIONS=--max-old-space-size=4096` before the deploy command |
| Contract address resets | Redeploy every time `npx hardhat node` restarts and update `CONTRACT_ADDRESS` in `contract.js` |
| MetaMask wrong network error | Switch MetaMask to Hardhat Local (Chain ID 31337) |
| Pinata 401 Unauthorized | Regenerate API keys from pinata.cloud and update `ipfs.js` |
| ENS not supported error | Make sure ethers.js is version 5.7.2 — run `npm install ethers@5.7.2` inside the frontend folder |

---

## 🔮 Future Work

- [ ] Deploy permanently to Polygon Amoy testnet
- [ ] Host frontend on Vercel with live public URL
- [ ] Add comment system (on-chain via smart contract)
- [ ] Search and filter memes by title or creator
- [ ] Auction system for meme NFTs
- [ ] DAO governance for content moderation
- [ ] On-chain trending algorithm (likes × time decay)
- [ ] Verify contract on Polygonscan for public transparency

---

## 🧪 Test Accounts (Hardhat Local Only)

These accounts are publicly known and safe for local testing only. Do NOT send real funds to them.

```
Account #0 — 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1 — 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2 — 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author
Shashank Hegde

Built as a Blockchain subject project.  
**MemeChain** — Decentralized Meme Sharing on the Blockchain 🐸
