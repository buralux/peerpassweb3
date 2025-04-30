import React, { ReactNode } from "react";
import TopAppBar from "./TopAppBar";
import BottomNavigation from "./BottomNavigation";
import FloatingActionButton from "./FloatingActionButton";
import { useWallet } from "@/hooks/use-wallet";
import { useLocation } from "wouter";

interface AppContainerProps {
  children: ReactNode;
}

const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  const { wallet, connect, disconnect, isConnected } = useWallet();
  const [location, setLocation] = useLocation();

  const onConnectWallet = async () => {
    await connect("injected");
  };

  const onScanQR = () => {
    setLocation("/scan");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-darkBg text-gray-800 dark:text-gray-200">
      <TopAppBar 
        isConnected={isConnected} 
        walletAddress={wallet?.address} 
        onConnect={onConnectWallet} 
        onDisconnect={disconnect} 
      />
      
      <main className="flex-1 px-4 pb-20">
        {children}
      </main>
      
      <BottomNavigation />
      
      <FloatingActionButton onClick={onScanQR} />
    </div>
  );
};

export default AppContainer;
