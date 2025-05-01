import React from "react";
import { getGradientClass, getMutedTextColor } from "@/lib/utils";
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
  const displayTokenId = tokenId || card.tokenId || (isPreview ? "#PREVIEW" : "NFT");
  
  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
      
      {/* Card content - Format carte bancaire (85.60 × 53.98 mm) ratio 1.586 */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 transform group-hover:scale-[1.01] transition-all duration-300 aspect-[1.586/1] w-full">
        {/* Token ID Badge */}
        <div className="absolute top-2 right-2 z-10 bg-black/30 backdrop-blur-md text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-[10px]">{displayTokenId}</span>
        </div>
        
        {/* Card Header - Styled like credit card with gradient */}
        <div className="bg-gradient-to-r from-primary to-purple-600 h-[30%] w-full relative">
          {/* Add chip icon like credit card */}
          <div className="absolute top-2 left-2 w-8 h-6 bg-yellow-400 bg-opacity-80 rounded-sm flex items-center justify-center">
            <div className="w-6 h-4 border border-yellow-600 rounded-sm flex items-center justify-center">
              <div className="w-4 h-2 border-b border-yellow-600"></div>
            </div>
          </div>
          
          {/* Company logo/name in top right */}
          {card.company && (
            <div className="absolute top-2 right-12 text-white font-bold text-sm">
              {card.company}
            </div>
          )}
        </div>
        
        {/* Main card content area - Divided into two columns like credit card */}
        <div className="p-3 flex flex-col h-[70%] justify-between">
          {/* Personal Info - Top section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 mr-2 flex-shrink-0">
                <AvatarImage 
                  src={card.avatarUrl || DEFAULT_AVATAR_URL} 
                  alt={`${card.name}'s avatar`} 
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-sm">
                  {card.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white text-sm">{card.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs">{card.jobTitle}</p>
              </div>
            </div>
            
            {/* Card type indication */}
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md px-2 py-0.5 text-xs">
              PEERPASS
            </div>
          </div>
          
          {/* Middle section with contact details - Like card number section */}
          <div className="grid grid-cols-1 gap-1.5 my-1 text-xs text-gray-600 dark:text-gray-400">
            {card.email && (
              <div className="flex items-center">
                <span className="material-icons text-primary dark:text-primary/80 text-xs mr-1">mail</span>
                <span className="truncate">{card.email}</span>
              </div>
            )}
            
            {card.phone && (
              <div className="flex items-center">
                <span className="material-icons text-primary dark:text-primary/80 text-xs mr-1">phone</span>
                <span>{card.phone}</span>
              </div>
            )}
            
            {card.website && (
              <div className="flex items-center">
                <span className="material-icons text-primary dark:text-primary/80 text-xs mr-1">language</span>
                <span className="truncate">{card.website}</span>
              </div>
            )}
            
            {card.bio && (
              <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-1 mt-0.5">
                {String(card.bio)}
              </p>
            )}
          </div>
          
          {/* Bottom section - Social & QR like card security elements */}
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-1.5">
            <div className="flex space-x-1.5">
              {/* Social Links */}
              {card.socialLinks && typeof card.socialLinks === 'object' && 
                Object.entries(card.socialLinks as Record<string, string>).map(([platform, url]) => (
                  <div key={platform} className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="material-icons text-primary dark:text-primary/80 text-xs">
                      {platform === "linkedin" ? "linkedin" : 
                       platform === "twitter" ? "twitter" : 
                       platform === "github" ? "code" : 
                       platform === "instagram" ? "camera_alt" : 
                       platform === "discord" ? "discord" : 
                       platform === "website" ? "language" : "link"}
                    </span>
                  </div>
                ))
              }
              
              {isPreview && (
                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="material-icons text-gray-500 dark:text-gray-400 text-xs">add</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              {onShare && (
                <button 
                  className="w-7 h-7 bg-primary/10 hover:bg-primary/20 text-primary rounded-full flex items-center justify-center transition mr-1.5" 
                  aria-label="Share card"
                  onClick={onShare}
                >
                  <span className="material-icons text-sm">share</span>
                </button>
              )}
              
              {/* QR code icon like card security code */}
              <div className="w-7 h-7 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="material-icons text-gray-500 dark:text-gray-400 text-sm">qr_code</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
