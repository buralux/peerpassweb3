import React, { useState } from "react";
import { getGradientClass } from "@/lib/utils";
import { BusinessCard as BusinessCardType, CardCustomization } from "@shared/schema";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  
  // Check for specific templates
  const isOmariTemplate = card.template === "omari";
  const isProfessionalTemplate = card.template === "professional";
  const isCreativeTemplate = card.template === "creative";
  const isBoldTemplate = card.template === "bold";
  const isModernTemplate = card.template === "modern";
  
  // Debugging template and color scheme
  console.log(`Business Card - Template: ${card.template}, ColorScheme: ${card.colorScheme}`);
  console.log(`Template flags: Omari=${isOmariTemplate}, Professional=${isProfessionalTemplate}, Creative=${isCreativeTemplate}, Bold=${isBoldTemplate}, Modern=${isModernTemplate}`);
  
  const flipCard = () => {
    setShowBack(!showBack);
  };
  
  return (
    <div className="relative group mb-6">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
      
      {/* Conteneur de carte avec aspect ratio 1.8/1 */}
      <div className="business-card">
        {/* Flipper container */}
        <div className={`card-flipper ${showBack ? 'is-flipped' : ''}`}>
          {/* FRONT SIDE */}
          <div 
            className={`card-front absolute inset-0 w-full h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 transition-all ${isPreview ? 'pointer-events-none' : 'cursor-pointer'}`}
            onClick={flipCard}
          >
            {isOmariTemplate ? (
              /* Omari Construction Card - Dark/Gold Theme */
              <div className="flex h-full bg-gray-900 text-white overflow-hidden rounded-xl">
                {/* Left side with logo and NFT badge */}
                <div className="w-1/3 p-4 flex flex-col items-center justify-center relative">
                  {/* NFT badge in top right */}
                  <div className="absolute top-2 right-1 bg-blue-600 px-2 py-0.5 rounded-full text-white text-xs font-bold">
                    NFT
                  </div>
                  
                  {/* Omari Construction Logo */}
                  <div className="w-24 h-24 flex items-center justify-center">
                    <img 
                      src="/omari-logo.svg" 
                      alt="Omari Construction Logo" 
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </div>
                
                {/* Right side with personal details */}
                <div className="w-2/3 p-4 flex flex-col justify-center">
                  <h3 className="font-bold text-white text-xl tracking-wide">
                    {card.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {card.jobTitle}
                  </p>
                  
                  <h4 className="text-amber-500 font-semibold mt-2">
                    {card.company}
                  </h4>
                  
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
                  </div>
                </div>
              </div>
            ) : (
              /* Template styling based on template type */
              <div className={`h-full rounded-xl overflow-hidden ${getGradientClass(card.colorScheme || "blue-violet")}`}>
                {/* Professional template */}
                {isProfessionalTemplate && (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-white">
                    <div className="w-full flex justify-end mb-2">
                      <div className="bg-white/20 px-2 py-0.5 rounded-full text-white text-xs font-bold">
                        NFT
                      </div>
                    </div>
                    
                    {/* Avatar */}
                    <Avatar className="w-16 h-16 rounded-full border-4 border-white/30 mb-3 shadow-md">
                      <AvatarImage 
                        src={card.avatarUrl || DEFAULT_AVATAR_URL} 
                        alt={`${card.name}'s avatar`} 
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback className="bg-white/20 text-white text-lg">
                        {card.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Name and Title */}
                    <h3 className="font-bold text-white text-xl tracking-wide mt-1 text-center">
                      {card.name}
                    </h3>
                    <p className="text-white/80 text-sm font-medium mb-2 text-center">
                      {card.jobTitle}
                    </p>
                    
                    {/* Company */}
                    <div className="text-white font-medium text-center bg-black/20 px-4 py-1 rounded-full">
                      {card.company}
                    </div>
                  </div>
                )}
                
                {/* Creative template */}
                {isCreativeTemplate && (
                  <div className="flex h-full overflow-hidden text-white">
                    <div className="w-1/3 bg-black/20 p-4 flex flex-col justify-center items-center">
                      <Avatar className="w-16 h-16 rounded-full mb-2">
                        <AvatarImage 
                          src={card.avatarUrl || DEFAULT_AVATAR_URL} 
                          alt={`${card.name}'s avatar`} 
                          className="w-full h-full object-cover"
                        />
                        <AvatarFallback className="bg-white/20 text-white text-lg">
                          {card.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="mt-2 bg-white/20 px-2 py-0.5 rounded-full text-white text-xs font-bold">
                        NFT
                      </div>
                    </div>
                    
                    <div className="w-2/3 p-4 flex flex-col justify-center">
                      <h3 className="font-bold text-white text-xl tracking-wide">
                        {card.name}
                      </h3>
                      <p className="text-white/80 text-sm mb-2">
                        {card.jobTitle}
                      </p>
                      
                      <h4 className="text-white font-semibold mt-2 bg-black/10 inline-block px-2 py-1 rounded">
                        {card.company}
                      </h4>
                    </div>
                  </div>
                )}
                
                {/* Bold template */}
                {isBoldTemplate && (
                  <div className="h-full flex flex-col text-white">
                    <div className="h-1/4 bg-black/20 flex items-center justify-between px-4">
                      <h2 className="font-bold text-lg">{card.company}</h2>
                      <div className="bg-white/20 px-2 py-0.5 rounded-full text-white text-xs font-bold">
                        NFT
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4 flex flex-col justify-center items-center">
                      <h3 className="font-bold text-white text-2xl tracking-wide mb-1 text-center">
                        {card.name}
                      </h3>
                      <div className="w-12 h-1 bg-white/50 rounded my-2"></div>
                      <p className="text-white/80 text-sm font-medium text-center">
                        {card.jobTitle}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Modern template (default) */}
                {(isModernTemplate || (!isProfessionalTemplate && !isCreativeTemplate && !isBoldTemplate && !isOmariTemplate)) && (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-white relative">
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/20 px-2 py-0.5 rounded-full text-white text-xs font-bold">
                        NFT
                      </div>
                    </div>
                    
                    {/* Avatar */}
                    <Avatar className="w-20 h-20 rounded-full border-4 border-white/30 mb-4 shadow-lg">
                      <AvatarImage 
                        src={card.avatarUrl || DEFAULT_AVATAR_URL} 
                        alt={`${card.name}'s avatar`} 
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback className="bg-white/20 text-white text-xl">
                        {card.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Name and Title */}
                    <h3 className="font-bold text-white text-xl tracking-wide mb-1 text-center">
                      {card.name}
                    </h3>
                    <p className="text-white/80 text-sm font-medium mb-2 text-center">
                      {card.jobTitle}
                    </p>
                    
                    {/* Company */}
                    <div className="text-white font-medium text-center mt-1">
                      {card.company}
                    </div>
                    
                    {/* Website */}
                    {card.website && (
                      <div className="mt-3 text-sm text-white/90 font-medium bg-black/20 px-3 py-1 rounded-full">
                        {card.website.replace(/^https?:\/\//, '')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Flip indicator */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-2 text-gray-100 dark:text-gray-200 text-[10px] flex items-center opacity-80 hover:opacity-100 z-10 bg-primary/70 dark:bg-primary/80 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all shadow-md hover:shadow-lg">
              <span className="material-icons text-xs mr-1">touch_app</span>
              <span>{t('cards.tapToFlip')}</span>
            </div>
          </div>
          
          {/* BACK SIDE */}
          <div 
            className={`card-back absolute inset-0 w-full h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 transition-all ${isPreview ? 'pointer-events-none' : 'cursor-pointer'}`}
            onClick={flipCard}
          >
            {/* Company header */}
            <div className={`${isOmariTemplate ? 'bg-amber-700' : getGradientClass(card.colorScheme || "gold")} h-[20%] w-full flex items-center justify-center relative rounded-t-xl`}>
              <h2 className="text-white font-bold text-lg">
                {isOmariTemplate ? "OMARI CONSTRUCTION" : (card.company || "PeerPass")}
              </h2>
            </div>
            
            <div className="h-[80%] p-3 flex justify-between relative">
              {/* Contact Information */}
              <div className={`${isOmariTemplate ? 'w-[60%]' : 'w-[65%]'} flex flex-col justify-center space-y-1.5 text-xs ${isOmariTemplate ? 'text-black dark:text-gray-200' : 'text-gray-700 dark:text-gray-300'}`}>
                {card.email && (
                  <div className="flex items-center">
                    <span className={`material-icons text-xs mr-1.5 ${isOmariTemplate ? 'text-amber-700 dark:text-amber-500' : 'text-primary dark:text-primary/80'}`}>mail</span>
                    <span className="truncate">{card.email}</span>
                  </div>
                )}
                
                {card.phone && (
                  <div className="flex items-center">
                    <span className={`material-icons text-xs mr-1.5 ${isOmariTemplate ? 'text-amber-700 dark:text-amber-500' : 'text-primary dark:text-primary/80'}`}>phone</span>
                    <span>{card.phone}</span>
                  </div>
                )}
                
                {card.website && (
                  <div className="flex items-center">
                    <span className={`material-icons text-xs mr-1.5 ${isOmariTemplate ? 'text-amber-700 dark:text-amber-500' : 'text-primary dark:text-primary/80'}`}>language</span>
                    <span className="truncate">{card.website}</span>
                  </div>
                )}
                
                {card.bio && (
                  <p className={`text-xs line-clamp-2 mt-1 ${isOmariTemplate ? 'text-gray-800 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
                    {card.bio}
                  </p>
                )}
              </div>
              
              {/* QR Code */}
              <div className={`${isOmariTemplate ? 'w-[40%]' : 'w-[35%]'} flex items-center justify-center`}>
                <div className={`${isOmariTemplate ? 'border-2 border-amber-700 p-1.5' : 'p-1'} bg-white rounded-lg`}>
                  <QRCodeSVG 
                    value={cardUrl}
                    size={isOmariTemplate ? 76 : 80}
                    level="M"
                    fgColor={isOmariTemplate ? "#B45309" : "#000000"}
                    bgColor="#FFFFFF"
                  />
                </div>
              </div>
            </div>
            
            {/* Share button */}
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
            
            {/* Flip indicator */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-2 text-gray-100 dark:text-gray-200 text-[10px] flex items-center opacity-80 hover:opacity-100 z-10 bg-primary/70 dark:bg-primary/80 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all shadow-md hover:shadow-lg">
              <span className="material-icons text-xs mr-1">touch_app</span>
              <span>{t('cards.tapToFlip')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;