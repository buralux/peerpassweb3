import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "wouter";
import { formatWalletAddress } from "@/lib/utils";

interface TopAppBarProps {
  isConnected: boolean;
  walletAddress?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

const TopAppBar: React.FC<TopAppBarProps> = ({ 
  isConnected, 
  walletAddress, 
  onConnect, 
  onDisconnect 
}) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="bg-white dark:bg-darkSurface shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button className="md:hidden mr-4" aria-label="Open menu">
            <span className="material-icons text-gray-700 dark:text-gray-300">menu</span>
          </button>
          <Link href="/">
            <h1 className="font-heading font-bold text-primary dark:text-secondary text-xl cursor-pointer">
              PeerPass
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" 
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            <span className="material-icons text-gray-700 dark:text-gray-300">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>
          
          {isConnected ? (
            <div className="flex items-center">
              <Button 
                variant="outline" 
                className="flex items-center space-x-1 text-sm mr-2"
                onClick={onDisconnect}
              >
                <span className="material-icons text-sm">account_balance_wallet</span>
                <span>{walletAddress ? formatWalletAddress(walletAddress) : "Connected"}</span>
              </Button>
            </div>
          ) : (
            <Button 
              className="flex items-center space-x-1 bg-primary text-white dark:bg-secondary px-3 py-1.5 rounded-full text-sm font-medium"
              onClick={onConnect}
            >
              <span className="material-icons text-sm">account_balance_wallet</span>
              <span>Connect</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopAppBar;
