import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "@/lib/queryClient";
import { 
  connectWallet, 
  disconnectWallet, 
  switchToCorrectChain,
  type ConnectedWallet,
  type WalletType,
  type ConnectionStatus,
  attachWalletListeners,
  detachWalletListeners
} from "@/lib/web3";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useWallet() {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [walletType, setWalletType] = useState<WalletType>(null);
  const { toast } = useToast();

  // Handle account changes
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setWallet(null);
      setStatus("disconnected");
      setWalletType(null);
    } else if (wallet && accounts[0] !== wallet.address) {
      // User switched accounts
      toast({
        title: "Account changed",
        description: "Your wallet account has been changed.",
      });
      
      // Update the wallet state with the new account
      connect(walletType);
    }
  }, [wallet, walletType, toast]);

  // Handle chain changes
  const handleChainChanged = useCallback(() => {
    // When chain changes, we need to reconnect to get the new chain information
    toast({
      title: "Network changed",
      description: "Your wallet network has been changed.",
    });
    
    // Update the wallet state with the new chain
    connect(walletType);
  }, [walletType, toast]);

  // Connect wallet
  const connect = useCallback(async (type: WalletType) => {
    if (!type) return;
    
    try {
      setStatus("connecting");
      setWalletType(type);
      
      // Connect to wallet
      const connectedWallet = await connectWallet(type);
      
      // Check if we're on the correct chain
      const isCorrectChain = await switchToCorrectChain();
      if (!isCorrectChain) {
        toast({
          title: "Wrong network",
          description: "Please switch to BNB Chain Testnet in your wallet.",
          variant: "destructive",
        });
      }
      
      // Set wallet state
      setWallet(connectedWallet);
      setStatus("connected");
      
      // Check if user exists, if not create one
      try {
        const response = await fetch(`/api/users/wallet/${connectedWallet.address}`);
        
        if (response.status === 404) {
          // User doesn't exist, create one
          await apiRequest("POST", "/api/users", {
            username: `user_${Date.now()}`,
            walletAddress: connectedWallet.address,
          });
        }
        
        // Invalidate user queries
        queryClient.invalidateQueries({ queryKey: [`/api/users/wallet/${connectedWallet.address}`] });
      } catch (error) {
        console.error("Error checking/creating user:", error);
      }
      
      return connectedWallet;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setStatus("error");
      
      toast({
        title: "Connection failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      
      return null;
    }
  }, [toast]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    if (!walletType) return;
    
    try {
      await disconnectWallet(walletType);
      setWallet(null);
      setStatus("disconnected");
      setWalletType(null);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        title: "Disconnect failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [walletType, toast]);

  // Set up wallet event listeners
  useEffect(() => {
    attachWalletListeners(handleAccountsChanged, handleChainChanged);
    
    return () => {
      detachWalletListeners(handleAccountsChanged, handleChainChanged);
    };
  }, [handleAccountsChanged, handleChainChanged]);

  // Restore connection from local storage
  useEffect(() => {
    const savedWalletType = localStorage.getItem("walletType") as WalletType;
    if (savedWalletType) {
      connect(savedWalletType);
    }
  }, [connect]);

  // Save wallet type to local storage when it changes
  useEffect(() => {
    if (walletType) {
      localStorage.setItem("walletType", walletType);
    } else {
      localStorage.removeItem("walletType");
    }
  }, [walletType]);

  return {
    wallet,
    status,
    connect,
    disconnect,
    isConnected: status === "connected",
    isConnecting: status === "connecting",
    walletType,
  };
}
