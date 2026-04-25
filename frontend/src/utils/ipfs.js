import axios from "axios";

const PINATA_API_KEY = "87815bdffa8aa191a6bd";
const PINATA_SECRET  = "b0ebed5fa50472009442236bdb361dbf2b99a3c6840aa5e41fa0c4d8fb0fa6e5";

export const uploadToIPFS = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET,
      },
    }
  );
  return response.data.IpfsHash;
};

export const ipfsToUrl = (cid) => {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
};

export const computeImageHash = async (file) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = "0x" + hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
};