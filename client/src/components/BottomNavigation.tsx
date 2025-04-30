import React from "react";
import { Link, useLocation } from "wouter";

const BottomNavigation: React.FC = () => {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const getItemClasses = (path: string) => {
    return isActive(path) 
      ? "flex flex-col items-center py-1 px-3 text-primary dark:text-secondary"
      : "flex flex-col items-center py-1 px-3 text-gray-500 dark:text-gray-400";
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-darkSurface border-t border-gray-200 dark:border-gray-800 px-4 py-2 z-40">
      <div className="flex justify-around items-center">
        <Link href="/">
          <a className={getItemClasses("/")}>
            <span className="material-icons">home</span>
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        
        <Link href="/cards">
          <a className={getItemClasses("/cards")}>
            <span className="material-icons">style</span>
            <span className="text-xs mt-1">Cards</span>
          </a>
        </Link>
        
        <Link href="/create">
          <a className={getItemClasses("/create")}>
            <span className="material-icons">add_circle</span>
            <span className="text-xs mt-1">Create</span>
          </a>
        </Link>
        
        <Link href="/scan">
          <a className={getItemClasses("/scan")}>
            <span className="material-icons">qr_code_scanner</span>
            <span className="text-xs mt-1">Scan</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className={getItemClasses("/profile")}>
            <span className="material-icons">person</span>
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
