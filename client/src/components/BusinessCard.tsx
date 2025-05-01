import React, { useState } from "react";
import { getGradientClass } from "@/lib/utils";
import { BusinessCard as BusinessCardType } from "@shared/schema";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DEFAULT_AVATAR_URL } from "@/lib/constants";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";

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
  
  const flipCard = () => {
    setShowBack(!showBack);
  };
  
  return (
    <div className="relative group mb-6 perspective-1000">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
      
      <div className="relative w-full h-[240px]">
        {/* Card Container with 3D effect */}
        <div 
          className={`relative bg-white dark:bg-gray-900 overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 w-full h-full transition-all duration-700 preserve-3d ${isPreview ? 'pointer-events-none' : 'cursor-pointer'}`} 
          style={{ 
            aspectRatio: "1.8 / 1",
            transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)"
          }}
          onClick={flipCard}
        >
          {/* FRONT SIDE OF CARD */}
          <div className="absolute w-full h-full backface-hidden card-front">
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
              /* Standard template styling */
              <div className="flex flex-col items-center justify-center h-full p-4">
                {/* Avatar */}
                <Avatar className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 mb-2 shadow-md">
                  <AvatarImage 
                    src={card.avatarUrl || DEFAULT_AVATAR_URL} 
                    alt={`${card.name}'s avatar`} 
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback className={`${getGradientClass(card.colorScheme || "gold")} text-white text-lg`}>
                    {card.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Name and Title */}
                <h3 className="font-bold text-gray-800 dark:text-white text-lg tracking-wide mt-1">
                  {card.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                  {card.jobTitle}
                </p>
                
                {/* Company */}
                <div className="text-gray-800 dark:text-gray-200 font-medium">
                  {card.company}
                </div>
                
                {/* Website */}
                {card.website && (
                  <div className="mt-2 text-sm text-primary dark:text-primary/90 font-medium">
                    {card.website.replace(/^https?:\/\//, '')}
                  </div>
                )}
              </div>
            )}
          </div>
        
          {/* BACK SIDE OF CARD */}
          <div className="absolute w-full h-full backface-hidden card-back" style={{ transform: "rotateY(180deg)" }}>
            {/* Company header */}
            <div className={`${isOmariTemplate ? 'bg-amber-700' : getGradientClass(card.colorScheme || "gold")} h-[20%] w-full flex items-center justify-center`}>
              <h2 className="text-white font-bold text-lg">
                {isOmariTemplate ? "OMARI CONSTRUCTION" : (card.company || "PeerPass")}
              </h2>
            </div>
            
            <div className="h-[80%] p-3 flex justify-between">
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
          </div>
        </div>
        
        {/* Flip indicator */}
        <div className="absolute right-2 bottom-2 text-gray-400 dark:text-gray-500 text-[10px] flex items-center opacity-70 hover:opacity-100 z-10 bg-black/10 dark:bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full transition-opacity">
          <span className="material-icons text-xs mr-0.5">360</span>
          <span>{t('cards.tapToFlip')}</span>
        </div>
        
        {/* Details button - SUPPRIMÉ */}
      </div>
    </div>
  );
};

export default BusinessCard;