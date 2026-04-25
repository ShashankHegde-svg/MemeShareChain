import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CONTRACT_ABI = [
  "function uploadMeme(string memory _ipfsCID, string memory _title, bytes32 _imageHash) public",
  "function likeMeme(uint256 _tokenId) public",
  "function transferMeme(address _to, uint256 _tokenId) public",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function getMeme(uint256 _tokenId) public view returns (tuple(uint256 tokenId, string ipfsCID, string title, address creator, uint256 likes, uint256 timestamp, bool isDuplicate, bytes32 imageHash))",
  "function getAllMemes() public view returns (tuple(uint256 tokenId, string ipfsCID, string title, address creator, uint256 likes, uint256 timestamp, bool isDuplicate, bytes32 imageHash)[])",
  "function isHashDuplicate(bytes32 _imageHash) public view returns (bool)",
  "function memeCount() public view returns (uint256)",
  "event MemeUploaded(uint256 indexed tokenId, string ipfsCID, string title, address indexed creator, bool isDuplicate)",
  "event MemeLiked(uint256 indexed tokenId, address indexed liker, uint256 newLikeCount)",
  "event MemeTransferred(uint256 indexed tokenId, address indexed from, address indexed to)",
];

export const getContract = async () => {
  if (!window.ethereum) {
    alert("MetaMask not found!");
    return null;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const getReadOnlyContract = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545",
  );
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};
