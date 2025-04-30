import React from "react";
import { getGradientClass, getMutedTextColor, getSocialIcon } from "@/lib/utils";
import { BusinessCard as BusinessCardType } from "@shared/schema";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatWalletAddress } from "@/lib/utils";
import { DEFAULT_AVATAR_URL } from "@/lib/constants";

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
  const displayTokenId = tokenId || card.tokenId || (isPreview ? "#PREVIEW" : "Not Minted");
  
  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
      
      {/* Card content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 transform group-hover:scale-[1.01] transition-all duration-300">
        {/* Token ID Badge */}
        <div className="absolute top-3 right-3 z-10 bg-black/30 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span>{displayTokenId}</span>
        </div>
        
        {/* Card Header with Gradient */}
        <div className="bg-gradient-to-r from-primary to-purple-600 h-20 w-full"></div>
        
        <div className="p-6 relative -mt-10">
          {/* Avatar */}
          <div className="flex items-start mb-4">
            <Avatar className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 mr-3 flex-shrink-0">
              <AvatarImage 
                src={card.avatarUrl || DEFAULT_AVATAR_URL} 
                alt={`${card.name}'s avatar`} 
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-xl">
                {card.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="pt-4">
              <h3 className="font-bold text-gray-800 dark:text-white text-xl">{card.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{card.jobTitle}</p>
            </div>
          </div>
          
          {/* Company & Bio */}
          <div className="mb-4">
            {card.company && (
              <div className="inline-flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 text-sm mb-2">
                <span className="material-icons text-sm mr-1">business</span>
                <span>{card.company}</span>
              </div>
            )}
            
            {card.bio && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                {card.bio}
              </p>
            )}
          </div>
          
          {/* Contact Information */}
          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            {card.email && (
              <div className="flex items-center text-sm">
                <span className="material-icons text-primary dark:text-primary/80 text-sm mr-2">mail</span>
                <span>{card.email}</span>
              </div>
            )}
            
            {card.phone && (
              <div className="flex items-center text-sm">
                <span className="material-icons text-primary dark:text-primary/80 text-sm mr-2">phone</span>
                <span>{card.phone}</span>
              </div>
            )}
            
            {card.website && (
              <div className="flex items-center text-sm">
                <span className="material-icons text-primary dark:text-primary/80 text-sm mr-2">language</span>
                <span className="truncate">{card.website}</span>
              </div>
            )}
          </div>
          
          {/* Social Links and Actions */}
          <div className="flex mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 justify-between">
            <div className="flex space-x-2">
              {/* Assuming socialLinks is a JSON object stored as a string - we need to parse it first */}
              {card.socialLinks && typeof card.socialLinks === 'object' && 
                Object.entries(card.socialLinks as Record<string, string>).map(([platform, url]) => (
                  <div key={platform} className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="material-icons text-primary dark:text-primary/80 text-sm">{getSocialIcon(platform)}</span>
                  </div>
                ))
              }
              
              {isPreview && (
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="material-icons text-gray-500 dark:text-gray-400 text-sm">add</span>
                </div>
              )}
            </div>
            
            {onShare && (
              <button 
                className="w-10 h-10 bg-primary/10 hover:bg-primary/20 text-primary rounded-full flex items-center justify-center transition" 
                aria-label="Share card"
                onClick={onShare}
              >
                <span className="material-icons">share</span>
              </button>
            )}
            
            {isPreview && (
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="material-icons text-gray-500 dark:text-gray-400">qr_code</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
