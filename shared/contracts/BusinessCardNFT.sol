// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BusinessCardNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Fee for minting a business card
    uint256 public mintFee = 0.001 ether;
    
    // Events
    event CardMinted(address indexed owner, uint256 tokenId, string tokenURI);
    event MintFeeUpdated(uint256 oldFee, uint256 newFee);
    
    constructor() ERC721("PeerPass Business Card", "PPBC") {}
    
    /**
     * @dev Mints a new business card NFT
     * @param to The address that will own the minted NFT
     * @param tokenURI The token URI of the NFT metadata
     * @return tokenId The ID of the newly minted NFT
     */
    function mint(address to, string memory tokenURI) external payable returns (uint256) {
        require(msg.value >= mintFee, "Insufficient fee");
        
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit CardMinted(to, tokenId, tokenURI);
        
        return tokenId;
    }
    
    /**
     * @dev Allows the contract owner to mint a card without a fee (for promotional purposes)
     * @param to The address that will own the minted NFT
     * @param tokenURI The token URI of the NFT metadata
     * @return tokenId The ID of the newly minted NFT
     */
    function adminMint(address to, string memory tokenURI) external onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit CardMinted(to, tokenId, tokenURI);
        
        return tokenId;
    }
    
    /**
     * @dev Updates the fee required to mint a business card
     * @param newFee The new fee amount
     */
    function updateMintFee(uint256 newFee) external onlyOwner {
        uint256 oldFee = mintFee;
        mintFee = newFee;
        emit MintFeeUpdated(oldFee, newFee);
    }
    
    /**
     * @dev Withdraws the contract balance to the owner
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}
