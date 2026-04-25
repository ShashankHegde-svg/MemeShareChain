// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MemePlatform is ERC721, Ownable {

    struct Meme {
        uint256 tokenId;
        string  ipfsCID;
        string  title;
        address creator;
        
        uint256 likes;
        uint256 timestamp;
        bool    isDuplicate;
        bytes32 imageHash;
    }

    uint256 public memeCount = 0;

    mapping(uint256 => Meme) public memes;
    mapping(bytes32 => uint256) public hashToTokenId;
    mapping(address => mapping(uint256 => bool)) public hasLiked;

    event MemeUploaded(uint256 indexed tokenId, string ipfsCID, string title, address indexed creator, bool isDuplicate);
    event MemeLiked(uint256 indexed tokenId, address indexed liker, uint256 newLikeCount);
    event MemeTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    constructor() ERC721("MemePlatform", "MEME") {}

    function uploadMeme(
        string memory _ipfsCID,
        string memory _title,
        bytes32 _imageHash
    ) public {
        memeCount++;
        uint256 newTokenId = memeCount;
        bool duplicate = false;

        if (hashToTokenId[_imageHash] != 0) {
            duplicate = true;
        } else {
            _mint(msg.sender, newTokenId);
            hashToTokenId[_imageHash] = newTokenId;
        }

        memes[newTokenId] = Meme({
            tokenId    : newTokenId,
            ipfsCID    : _ipfsCID,
            title      : _title,
            creator    : msg.sender,
            likes      : 0,
            timestamp  : block.timestamp,
            isDuplicate: duplicate,
            imageHash  : _imageHash
        });

        emit MemeUploaded(newTokenId, _ipfsCID, _title, msg.sender, duplicate);
    }

    function likeMeme(uint256 _tokenId) public {
        require(_tokenId > 0 && _tokenId <= memeCount, "Meme does not exist");
        require(!hasLiked[msg.sender][_tokenId], "You already liked this meme");
        require(memes[_tokenId].creator != msg.sender, "Cannot like your own meme");

        memes[_tokenId].likes++;
        hasLiked[msg.sender][_tokenId] = true;

        emit MemeLiked(_tokenId, msg.sender, memes[_tokenId].likes);
    }

    function transferMeme(address _to, uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender, "You don't own this meme");
        require(_to != address(0), "Invalid address");

        memes[_tokenId].creator = _to;
        safeTransferFrom(msg.sender, _to, _tokenId);

        emit MemeTransferred(_tokenId, msg.sender, _to);
    }

    function getMeme(uint256 _tokenId) public view returns (Meme memory) {
        require(_tokenId > 0 && _tokenId <= memeCount, "Meme does not exist");
        return memes[_tokenId];
    }

    function getAllMemes() public view returns (Meme[] memory) {
        Meme[] memory allMemes = new Meme[](memeCount);
        for (uint256 i = 1; i <= memeCount; i++) {
            allMemes[i - 1] = memes[i];
        }
        return allMemes;
    }

    function isHashDuplicate(bytes32 _imageHash) public view returns (bool) {
        return hashToTokenId[_imageHash] != 0;
    }
}