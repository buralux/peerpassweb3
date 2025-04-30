import React from "react";

interface DashboardStatsProps {
  cardCount: number;
  collectedCount: number;
  chainName: string;
  walletAddress: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  cardCount,
  collectedCount,
  chainName,
  walletAddress,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
      <div className="bg-white dark:bg-darkSurface p-4 rounded-xl card-shadow">
        <p className="text-sm text-gray-500 dark:text-gray-400">Your Cards</p>
        <p className="font-bold text-2xl text-gray-800 dark:text-white">{cardCount}</p>
      </div>
      
      <div className="bg-white dark:bg-darkSurface p-4 rounded-xl card-shadow">
        <p className="text-sm text-gray-500 dark:text-gray-400">Collected</p>
        <p className="font-bold text-2xl text-gray-800 dark:text-white">{collectedCount}</p>
      </div>
      
      <div className="bg-white dark:bg-darkSurface p-4 rounded-xl card-shadow">
        <p className="text-sm text-gray-500 dark:text-gray-400">Chain</p>
        <p className="font-bold text-lg text-gray-800 dark:text-white truncate">{chainName}</p>
      </div>
      
      <div className="bg-white dark:bg-darkSurface p-4 rounded-xl card-shadow">
        <p className="text-sm text-gray-500 dark:text-gray-400">Wallet</p>
        <p className="font-bold text-sm text-gray-800 dark:text-white truncate">{walletAddress}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
