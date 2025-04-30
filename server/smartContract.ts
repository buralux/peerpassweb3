import { ethers } from "ethers";

// This would be the ABI of your deployed smart contract
const BusinessCardNFTABI = [
  "function mint(address to, string memory tokenURI) external returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function transferFrom(address from, address to, uint256 tokenId) external",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

// Contract addresses
const CONTRACT_ADDRESSES = {
  testnet: process.env.BUSINESS_CARD_NFT_CONTRACT_TESTNET || "0x0000000000000000000000000000000000000000",
  mainnet: process.env.BUSINESS_CARD_NFT_CONTRACT_MAINNET || "0x0000000000000000000000000000000000000000"
};

// BNB Chain RPC URLs
const RPC_URLS = {
  testnet: process.env.BNB_CHAIN_TESTNET_RPC || "https://data-seed-prebsc-1-s1.binance.org:8545/",
  mainnet: process.env.BNB_CHAIN_MAINNET_RPC || "https://bsc-dataseed.binance.org/"
};

// Default to testnet for safety
const DEFAULT_NETWORK = "testnet";

export async function mintBusinessCardNFT(ownerAddress: string, tokenURI: string): Promise<{ tokenId: string, txHash: string }> {
  try {
    const privateKey = process.env.CONTRACT_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Contract private key not found in environment variables");
    }

    const network = process.env.BLOCKCHAIN_NETWORK || DEFAULT_NETWORK;
    const contractAddress = CONTRACT_ADDRESSES[network as keyof typeof CONTRACT_ADDRESSES];
    const rpcUrl = RPC_URLS[network as keyof typeof RPC_URLS];

    // Connect to the network
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, BusinessCardNFTABI, wallet);
    
    // Mint the NFT
    console.log(`Minting NFT for ${ownerAddress} with tokenURI: ${tokenURI}`);
    const tx = await contract.mint(ownerAddress, tokenURI);
    const receipt = await tx.wait();
    
    // Find the Transfer event to get the token ID
    const transferEvent = receipt.logs
      .map((log: any) => {
        try {
          return contract.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find((event: any) => event && event.name === "Transfer");
    
    if (!transferEvent) {
      throw new Error("Transfer event not found in transaction logs");
    }
    
    const tokenId = transferEvent.args[2].toString();
    
    return {
      tokenId,
      txHash: receipt.hash
    };
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw new Error(`Failed to mint NFT: ${(error as Error).message}`);
  }
}

export async function transferBusinessCardNFT(from: string, to: string, tokenId: string): Promise<{ txHash: string }> {
  try {
    const privateKey = process.env.CONTRACT_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Contract private key not found in environment variables");
    }

    const network = process.env.BLOCKCHAIN_NETWORK || DEFAULT_NETWORK;
    const contractAddress = CONTRACT_ADDRESSES[network as keyof typeof CONTRACT_ADDRESSES];
    const rpcUrl = RPC_URLS[network as keyof typeof RPC_URLS];

    // Connect to the network
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, BusinessCardNFTABI, wallet);
    
    // Transfer the NFT
    console.log(`Transferring NFT #${tokenId} from ${from} to ${to}`);
    const tx = await contract.transferFrom(from, to, tokenId);
    const receipt = await tx.wait();
    
    return {
      txHash: receipt.hash
    };
  } catch (error) {
    console.error("Error transferring NFT:", error);
    throw new Error(`Failed to transfer NFT: ${(error as Error).message}`);
  }
}
