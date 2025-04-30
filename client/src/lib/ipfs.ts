// IPFS Gateway URLs
export const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://ipfs.infura.io/ipfs/",
];

/**
 * Resolves an IPFS URI to an HTTP URL
 * @param ipfsUri IPFS URI (e.g., "ipfs://QmXyZ...")
 * @param gatewayIndex Index of the gateway to use (optional, defaults to 0)
 * @returns HTTP URL
 */
export function resolveIpfsUri(ipfsUri: string, gatewayIndex = 0): string {
  if (!ipfsUri) return "";
  
  // Make sure we have a valid gateway index
  const index = gatewayIndex % IPFS_GATEWAYS.length;
  const gateway = IPFS_GATEWAYS[index];
  
  // Handle ipfs:// protocol
  if (ipfsUri.startsWith("ipfs://")) {
    const hash = ipfsUri.replace("ipfs://", "");
    return `${gateway}${hash}`;
  }
  
  // Handle hash only
  if (ipfsUri.startsWith("Qm") || ipfsUri.startsWith("ba")) {
    return `${gateway}${ipfsUri}`;
  }
  
  // Handle HTTP URLs that already point to an IPFS gateway
  for (const gw of IPFS_GATEWAYS) {
    if (ipfsUri.startsWith(gw)) {
      const hash = ipfsUri.replace(gw, "");
      return `${gateway}${hash}`;
    }
  }
  
  // If it's already an HTTP URL, return as is
  if (ipfsUri.startsWith("http")) {
    return ipfsUri;
  }
  
  // Default fallback
  return `${gateway}${ipfsUri}`;
}

/**
 * Fetches metadata from an IPFS URI
 * @param ipfsUri IPFS URI (e.g., "ipfs://QmXyZ...")
 * @returns Parsed JSON metadata
 */
export async function fetchIpfsMetadata<T>(ipfsUri: string): Promise<T> {
  const url = resolveIpfsUri(ipfsUri);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as T;
  } catch (error) {
    console.error("Error fetching IPFS metadata:", error);
    
    // Try with another gateway
    const nextGatewayUrl = resolveIpfsUri(ipfsUri, 1);
    const fallbackResponse = await fetch(nextGatewayUrl);
    return await fallbackResponse.json() as T;
  }
}
