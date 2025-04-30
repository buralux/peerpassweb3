import { ethers } from "ethers";
import { ACTIVE_CHAIN, CHAIN_CONFIG } from "./constants";

// Declare window.ethereum type
declare global {
  interface Window {
    ethereum?: any;
  }
}

// We'll initialize WalletConnect Provider only when needed to avoid initialization errors
let walletConnectProvider: any = null;

// Types
export interface ConnectedWallet {
  address: string;
  provider: ethers.BrowserProvider;
  chainId: string;
  signer: ethers.JsonRpcSigner;
}

export type WalletType = "injected" | "walletconnect" | null;
export type ConnectionStatus = "connected" | "connecting" | "disconnected" | "error";

// Functions for wallet connection
export async function connectWallet(walletType: WalletType): Promise<ConnectedWallet> {
  let provider;

  if (walletType === "injected") {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }
    provider = new ethers.BrowserProvider(window.ethereum);
  } else if (walletType === "walletconnect") {
    try {
      // Dynamically import WalletConnect only when needed
      const WalletConnectProvider = (await import("@walletconnect/web3-provider")).default;
      
      // Initialize WalletConnect Provider if not already initialized
      if (!walletConnectProvider) {
        walletConnectProvider = new WalletConnectProvider({
          rpc: {
            97: ACTIVE_CHAIN.rpcUrls[0], // BSC Testnet
            56: CHAIN_CONFIG.mainnet.rpcUrls[0], // BSC Mainnet
          },
        });
      }
      
      // Enable WalletConnect session
      await walletConnectProvider.enable();
      provider = new ethers.BrowserProvider(walletConnectProvider);
    } catch (error) {
      console.error("WalletConnect initialization error:", error);
      throw new Error("Could not initialize WalletConnect");
    }
  } else {
    throw new Error("Invalid wallet type");
  }

  // Get accounts
  const accounts = await provider.listAccounts();
  if (accounts.length === 0) {
    throw new Error("No accounts found");
  }

  // Get signer and chain ID
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  const chainId = network.chainId.toString();

  return {
    address: accounts[0].address,
    provider,
    chainId,
    signer,
  };
}

export async function disconnectWallet(walletType: WalletType): Promise<void> {
  if (walletType === "walletconnect") {
    await walletConnectProvider.disconnect();
  }
  // MetaMask doesn't have a disconnect method
}

export async function switchToCorrectChain(): Promise<boolean> {
  if (!window.ethereum) return false;

  try {
    // Try to switch to the correct chain
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ACTIVE_CHAIN.chainId }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [ACTIVE_CHAIN],
        });
        return true;
      } catch (addError) {
        console.error("Failed to add chain:", addError);
        return false;
      }
    }
    console.error("Failed to switch chain:", switchError);
    return false;
  }
}

export async function signMessage(message: string, signer: ethers.JsonRpcSigner): Promise<string> {
  return await signer.signMessage(message);
}

// Helper to format addresses
export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Attach event listeners for account and chain changes
export function attachWalletListeners(
  handleAccountsChanged: (accounts: string[]) => void,
  handleChainChanged: (chainId: string) => void
): void {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
  }

  // Only attach WalletConnect listeners if provider is initialized
  if (walletConnectProvider) {
    walletConnectProvider.on("accountsChanged", handleAccountsChanged);
    walletConnectProvider.on("chainChanged", handleChainChanged);
  }
}

export function detachWalletListeners(
  handleAccountsChanged: (accounts: string[]) => void,
  handleChainChanged: (chainId: string) => void
): void {
  if (window.ethereum) {
    window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    window.ethereum.removeListener("chainChanged", handleChainChanged);
  }

  // Only detach WalletConnect listeners if provider is initialized
  if (walletConnectProvider) {
    walletConnectProvider.removeListener("accountsChanged", handleAccountsChanged);
    walletConnectProvider.removeListener("chainChanged", handleChainChanged);
  }
}
