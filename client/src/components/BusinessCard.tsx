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
  
  const toggleCardSide = () => {
    setShowBack(!showBack);
  };
  
  return (
    <div className="relative group cursor-pointer" onClick={toggleCardSide}>
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
      
      {/* Card content - Format carte bancaire (85.60 × 53.98 mm) ratio 1.586 */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 transform group-hover:scale-[1.01] transition-all duration-500 aspect-[1.586/1] w-full perspective-1000">
        
        <div className={`absolute w-full h-full backface-visibility-hidden transition-transform duration-500 ease-in-out ${showBack ? "rotate-y-180 opacity-0" : "rotate-y-0 opacity-100"}`}>
          {/* FRONT SIDE OF CARD */}
          
          {/* Token ID Badge */}
          <div className="absolute top-2 right-2 z-10 bg-black/30 backdrop-blur-md text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-[10px]">{displayTokenId}</span>
          </div>
          
          {/* Card Header - Full width colored gradient background */}
          <div className={`${getGradientClass(card.colorScheme || "gold")} h-[40%] w-full relative`}>
            {/* Add chip icon like credit card (hide for Omari template) */}
            {!isOmariTemplate && (
              <div className="absolute top-2 left-2 w-8 h-6 bg-yellow-400 bg-opacity-80 rounded-sm flex items-center justify-center">
                <div className="w-6 h-4 border border-yellow-600 rounded-sm flex items-center justify-center">
                  <div className="w-4 h-2 border-b border-yellow-600"></div>
                </div>
              </div>
            )}
            
            {/* Omari logo for Omari template */}
            {isOmariTemplate && card.colorScheme === "gold-black" && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <img 
                  src="/logo-omari.svg" 
                  alt="Omari Construction"
                  className="h-12 w-auto" 
                />
              </div>
            )}
            
            {/* Company logo in top center (only for non-Omari templates) */}
            {card.company && !isOmariTemplate && (
              <div className="absolute top-3 right-12 text-white font-bold text-sm tracking-wider uppercase">
                {card.company}
              </div>
            )}
          </div>
          
          {/* Main card content area - Center aligned for elegant front design */}
          <div className="flex flex-col items-center justify-center text-center h-[60%] px-4">
            {isOmariTemplate ? (
              /* Omari template has special styling */
              <div className="flex flex-col items-center justify-center mt-4">
                {/* Name and Title for Omari - Gold accent styling */}
                <h3 className="font-bold text-black dark:text-yellow-500 text-lg tracking-wider uppercase mt-3">
                  {card.name}
                </h3>
                <div className="w-12 h-0.5 bg-yellow-600 my-2"></div>
                <p className="text-black dark:text-gray-300 text-sm font-medium">
                  {card.jobTitle}
                </p>
                
                {/* Simple contact row for Omari - Gold accent */}
                {card.website && (
                  <div className="mt-3 text-sm text-yellow-700 dark:text-yellow-500 font-medium">
                    {card.website.replace(/^https?:\/\//, '')}
                  </div>
                )}
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
        </div>
        
        <div className={`absolute w-full h-full backface-visibility-hidden transition-transform duration-500 ease-in-out ${!showBack ? "rotate-y-180 opacity-0" : "rotate-y-0 opacity-100"}`}>
          {/* BACK SIDE OF CARD */}
          
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
                  Object.entries(card.socialLinks as Record<string, string>).map(([platform, url]) => {
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
        
        {/* Flip indicator */}
        <div className="absolute right-2 bottom-2 text-gray-400 dark:text-gray-500 text-[10px] flex items-center opacity-50" onClick={(e) => e.stopPropagation()}>
          <span className="material-icons text-xs mr-0.5">360</span>
          <span>{t('cards.tapToFlip')}</span>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
