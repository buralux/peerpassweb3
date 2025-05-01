import React from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";

const BottomNavigation: React.FC = () => {
  const [location] = useLocation();
  const { t } = useTranslation();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const getItemClasses = (path: string) => {
    return isActive(path) 
      ? "flex flex-col items-center py-1 px-3 text-primary dark:text-secondary cursor-pointer"
      : "flex flex-col items-center py-1 px-3 text-gray-500 dark:text-gray-400 cursor-pointer";
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-darkSurface border-t border-gray-200 dark:border-gray-800 px-4 py-2 z-40">
      <div className="flex justify-around items-center">
        <Link href="/">
          <div className={getItemClasses("/")}>
            <span className="material-icons">home</span>
            <span className="text-xs mt-1">{t('nav.home')}</span>
          </div>
        </Link>
        
        <Link href="/cards">
          <div className={getItemClasses("/cards")}>
            <span className="material-icons">style</span>
            <span className="text-xs mt-1">{t('nav.cards')}</span>
          </div>
        </Link>
        
        <Link href="/create">
          <div className={getItemClasses("/create")}>
            <span className="material-icons">add_circle</span>
            <span className="text-xs mt-1">{t('nav.create')}</span>
          </div>
        </Link>
        
        <Link href="/scan">
          <div className={getItemClasses("/scan")}>
            <span className="material-icons">qr_code_scanner</span>
            <span className="text-xs mt-1">{t('nav.scan')}</span>
          </div>
        </Link>
        
        <Link href="/profile">
          <div className={getItemClasses("/profile")}>
            <span className="material-icons">person</span>
            <span className="text-xs mt-1">{t('nav.profile')}</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
