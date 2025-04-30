import { BusinessCard } from "@shared/schema";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

export async function uploadToIPFS(data: string | object): Promise<string> {
  try {
    // For demonstration, we're using a mock IPFS hash
    // In a real implementation, we would use a library like web3.storage
    // or connect to an IPFS node
    
    // Create a hash based on the current timestamp and some random values
    // This is just to simulate the IPFS hash format during development
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    console.log(`[IPFS] Uploaded data to IPFS with hash: ${mockHash}`);
    
    return mockHash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error("Failed to upload to IPFS");
  }
}

export function generateCardMetadata(card: BusinessCard, imageUrl: string): NFTMetadata {
  return {
    name: `${card.name}'s Business Card`,
    description: card.bio || `${card.name}'s professional identity card on PeerPass`,
    image: imageUrl,
    external_url: `https://peerpass.xyz/card/${card.tokenId}`,
    attributes: [
      {
        trait_type: "Name",
        value: card.name
      },
      {
        trait_type: "Job Title",
        value: card.jobTitle
      },
      {
        trait_type: "Company",
        value: card.company || ""
      },
      {
        trait_type: "Template",
        value: card.template
      },
      {
        trait_type: "Color Scheme",
        value: card.colorScheme
      }
    ]
  };
}

export async function createCardImage(card: BusinessCard): Promise<string> {
  // In a real implementation, we would generate an SVG or PNG image
  // For now, we'll return a placeholder URL
  return `https://peerpass.xyz/api/card-image/${card.id}`;
}

export async function prepareCardForMinting(card: BusinessCard): Promise<{ ipfsHash: string, metadata: NFTMetadata }> {
  // Create a card image (SVG)
  const imageUrl = await createCardImage(card);
  
  // Generate metadata
  const metadata = generateCardMetadata(card, imageUrl);
  
  // Upload metadata to IPFS
  const ipfsHash = await uploadToIPFS(metadata);
  
  return { ipfsHash, metadata };
}
