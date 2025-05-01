import React, { useState } from "react";
import { getGradientClass, getMutedTextColor } from "@/lib/utils";
import { BusinessCard as BusinessCardType } from "@shared/schema";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatWalletAddress } from "@/lib/utils";
import { DEFAULT_AVATAR_URL } from "@/lib/constants";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";

interface BusinessCardProps {
  card: BusinessCardType;
  isPreview?: boolean;
  tokenId?: string;
  onShare?: () => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({
  card,
  isPreview = false,
  tokenId,
  onShare,
}) => {
  const { t } = useTranslation();
  const [showBack, setShowBack] = useState(false);
  const displayTokenId = tokenId || card.tokenId || (isPreview ? "#PREVIEW" : "NFT");
  
  // Créer une URL pour le code QR qui pointe vers le profil
  const cardUrl = `${window.location.origin}/card/${card.id}`;
  
  // Check if this is the Omari template
  const isOmariTemplate = card.template === "omari";
  
  const toggleCardSide = (e: React.MouseEvent<HTMLDivElement>) => {
    // Empêcher la navigation et autres comportements par défaut
    e.preventDefault();
    e.stopPropagation();
    setShowBack(!showBack);
  };
  
  return (
    <div className="relative group mb-6" style={{ perspective: "1000px" }}>
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
      
      <div className="relative w-full h-[240px] cursor-pointer">
        {/* Carte 3D */}
        <div 
          className={`relative bg-white dark:bg-gray-900 overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 w-full h-full transition-all duration-700 transform-gpu preserve-3d ${isPreview ? 'pointer-events-none' : ''}`} 
          style={{ 
            transformStyle: "preserve-3d", 
            transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
            aspectRatio: "1.8 / 1" 
          }}
          onClick={toggleCardSide}
        >
          {/* FRONT SIDE OF CARD */}
          <div className="absolute w-full h-full backface-hidden" style={{ backfaceVisibility: "hidden" }}>
            {isOmariTemplate ? (
              /* Inspired by the shared reference, modern card layout */
              <div className="flex h-full bg-gray-900 text-white overflow-hidden rounded-xl">
                {/* Left column with avatar/logo or NFT badge */}
                <div className="w-1/3 p-4 flex flex-col items-center justify-center relative">
                  {/* NFT badge in top right */}
                  <div className="absolute top-2 right-2 bg-violet-600 px-3 py-1 rounded-full text-white text-xs font-bold">
                    NFT
                  </div>
                  
                  {/* Omari Construction Logo */}
                  <div className="w-20 h-20 flex items-center justify-center">
                    <svg width="80" height="80" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#BF8F00" />
                          <stop offset="50%" stopColor="#FFDB58" />
                          <stop offset="100%" stopColor="#DAA520" />
                        </linearGradient>
                      </defs>
                      
                      {/* Circle with skyline */}
                      <circle cx="180" cy="180" r="170" stroke="url(#goldGradient)" strokeWidth="10" fill="none" />
                      
                      {/* Skyline buildings */}
                      <path d="M100,280 L100,200 L120,200 L120,230 L140,230 L140,180 L160,180 L160,280" stroke="url(#goldGradient)" strokeWidth="4" fill="none" />
                      <path d="M170,280 L170,160 L180,140 L190,160 L190,280" stroke="url(#goldGradient)" strokeWidth="4" fill="none" />
                      <path d="M200,280 L200,210 L220,210 L220,280" stroke="url(#goldGradient)" strokeWidth="4" fill="none" />
                      <path d="M230,280 L230,190 L250,190 L250,280" stroke="url(#goldGradient)" strokeWidth="4" fill="none" />
                      
                      {/* OMARI text */}
                      <text x="360" y="180" fontFamily="Arial, sans-serif" fontSize="110" fontWeight="bold" fill="url(#goldGradient)">OMARI</text>
                      
                      {/* CONSTRUCTION GROUP text */}
                      <text x="360" y="260" fontFamily="Arial, sans-serif" fontSize="50" letterSpacing="2" fill="url(#goldGradient)">CONSTRUCTION GROUP</text>
                    </svg>
                  </div>
                </div>
                
                {/* Right column with details */}
                <div className="w-2/3 p-4 flex flex-col justify-center">
                  <h3 className="font-bold text-white text-xl tracking-wide">
                    {card.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {card.jobTitle}
                  </p>
                  
                  <h4 className="text-gray-200 font-semibold mt-2">
                    {card.company}
                  </h4>
                  
                  <p className="text-gray-400 mt-2 text-xs line-clamp-2">
                    {card.bio}
                  </p>
                  
                  {/* Contact details */}
                  <div className="mt-4 space-y-1 text-xs">
                    {card.email && (
                      <div className="flex items-center">
                        <span className="material-icons text-xs mr-2 text-gray-400">mail</span>
                        <span className="text-gray-300">{card.email}</span>
                      </div>
                    )}
                    
                    {card.phone && (
                      <div className="flex items-center">
                        <span className="material-icons text-xs mr-2 text-gray-400">phone</span>
                        <span className="text-gray-300">{card.phone}</span>
                      </div>
                    )}
                    
                    {card.website && (
                      <div className="flex items-center">
                        <span className="material-icons text-xs mr-2 text-gray-400">language</span>
                        <span className="text-gray-300">{card.website.replace(/^https?:\/\//, '')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Standard template styling */
              <>
                {/* Avatar - Optionally positioned slightly above to overlap with gradient */}
                <Avatar className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 mb-2 -mt-8 shadow-md">
                  <AvatarImage 
                    src={card.avatarUrl || DEFAULT_AVATAR_URL} 
                    alt={`${card.name}'s avatar`} 
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback className={`${getGradientClass(card.colorScheme || "gold")} text-white text-lg`}>
                    {card.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Name and Title - Elegant centered layout */}
                <h3 className="font-bold text-gray-800 dark:text-white text-lg tracking-wide mt-1">
                  {card.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                  {card.jobTitle}
                </p>
                
                {/* Simple contact row - Just website for clean front design */}
                {card.website && (
                  <div className="mt-2 text-sm text-primary dark:text-primary/90 font-medium">
                    {card.website.replace(/^https?:\/\//, '')}
                  </div>
                )}
              </>
            )}
          </div>
        
          {/* BACK SIDE OF CARD */}
          <div className="absolute w-full h-full backface-hidden" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            {/* Company header - More subdued on back */}
            <div className={`${getGradientClass(card.colorScheme || "gold")} h-[20%] w-full flex items-center justify-center`}>
              <h2 className="text-white font-bold text-lg">
                {isOmariTemplate ? "OMARI CONSTRUCTION" : (card.company || "PeerPass")}
              </h2>
            </div>
            
            <div className="h-[80%] p-3 flex justify-between">
              {/* Contact Information - Left aligned details */}
              <div className={`${isOmariTemplate ? 'w-[60%]' : 'w-[65%]'} flex flex-col justify-center space-y-1.5 text-xs ${isOmariTemplate ? 'text-black dark:text-gray-200' : 'text-gray-700 dark:text-gray-300'}`}>
                {card.email && (
                  <div className="flex items-center">
                    <span className={`material-icons text-xs mr-1.5 ${isOmariTemplate ? 'text-yellow-600 dark:text-yellow-500' : 'text-primary dark:text-primary/80'}`}>mail</span>
                    <span className="truncate">{card.email}</span>
                  </div>
                )}
                
                {card.phone && (
                  <div className="flex items-center">
                    <span className={`material-icons text-xs mr-1.5 ${isOmariTemplate ? 'text-yellow-600 dark:text-yellow-500' : 'text-primary dark:text-primary/80'}`}>phone</span>
                    <span>{card.phone}</span>
                  </div>
                )}
                
                {card.website && (
                  <div className="flex items-center">
                    <span className={`material-icons text-xs mr-1.5 ${isOmariTemplate ? 'text-yellow-600 dark:text-yellow-500' : 'text-primary dark:text-primary/80'}`}>language</span>
                    <span className="truncate">{card.website}</span>
                  </div>
                )}
                
                {card.bio && (
                  <p className={`text-xs line-clamp-2 mt-1 ${isOmariTemplate ? 'text-gray-800 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
                    {String(card.bio)}
                  </p>
                )}
                
                {/* Social Links as icons in a row */}
                <div className="flex space-x-1.5 mt-1 pt-1">
                  {card.socialLinks && typeof card.socialLinks === 'object' && 
                    Object.entries(card.socialLinks as Record<string, string>)
                      .map(([platform, url]) => {
                        // Déterminer l'icône à afficher en fonction de la plateforme
                        let iconName = "link";
                        if (platform === "linkedin") iconName = "linkedin";
                        else if (platform === "twitter") iconName = "twitter";
                        else if (platform === "github") iconName = "code";
                        else if (platform === "instagram") iconName = "camera_alt";
                        else if (platform === "discord") iconName = "discord";
                        else if (platform === "website") iconName = "language";
                        
                        return (
                          <div key={platform} className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            isOmariTemplate ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <span className={`material-icons text-[10px] ${
                              isOmariTemplate ? 'text-yellow-600 dark:text-yellow-500' : 'text-primary dark:text-primary/80'
                            }`}>
                              {iconName}
                            </span>
                          </div>
                        );
                      })
                  }
                </div>
              </div>
              
              {/* QR Code - Right aligned */}
              <div className={`${isOmariTemplate ? 'w-[40%]' : 'w-[35%]'} flex items-center justify-center`}>
                <div className={`${isOmariTemplate ? 'border-2 border-yellow-600 p-1.5' : 'p-1'} bg-white rounded-lg`}>
                  <QRCodeSVG 
                    value={cardUrl}
                    size={isOmariTemplate ? 76 : 80}
                    level="M"
                    fgColor={isOmariTemplate ? "#DAA520" : "#000000"}
                    bgColor="#FFFFFF"
                  />
                </div>
              </div>
            </div>
            
            {/* Optional share button - Positioned in the lower bottom */}
            {onShare && (
              <button 
                className="absolute bottom-2 right-2 w-6 h-6 bg-primary/10 hover:bg-primary/20 text-primary rounded-full flex items-center justify-center transition" 
                aria-label="Share card"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare();
                }}
              >
                <span className="material-icons text-xs">share</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Flip indicator */}
        <div className="absolute right-2 bottom-2 text-gray-400 dark:text-gray-500 text-[10px] flex items-center opacity-50 z-10">
          <span className="material-icons text-xs mr-0.5">360</span>
          <span>{t('cards.tapToFlip')}</span>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;