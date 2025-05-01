import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "wouter";
import { formatWalletAddress } from "@/lib/utils";
import peerpassLogo from "../assets/peerpass-logo.png";
import { useTranslation } from 'react-i18next';
import LanguageSelector from "./LanguageSelector";

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
  const { t } = useTranslation();
  
  return (
    <header className="bg-white dark:bg-darkSurface shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <button className="md:hidden mr-4" aria-label="Open menu">
            <span className="material-icons text-gray-700 dark:text-gray-300">menu</span>
          </button>
          <div className="flex items-center cursor-pointer" onClick={() => {
              // Utiliser navigate au lieu de window.location pour éviter un rechargement complet
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}>
              <img 
                src={peerpassLogo} 
                alt="PeerPass Logo" 
                className="h-12 mr-2 filter drop-shadow-lg hover:drop-shadow-xl transition-all duration-300 ease-in-out" 
              />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          
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
            <div className="relative">
              <Button 
                className="flex items-center space-x-1 bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 px-3 py-1.5 rounded-full text-sm font-medium opacity-70 cursor-not-allowed"
                onClick={() => {
                  // Temporairement désactivé pour les tests
                  // onConnect();
                }}
                disabled
              >
                <span className="material-icons text-sm">account_balance_wallet</span>
                <span>Connect</span>
              </Button>
              <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1 rounded-full">
                Test
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopAppBar;
