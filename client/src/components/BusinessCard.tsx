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
  const gradientClass = getGradientClass(card.colorScheme);
  const mutedTextClass = getMutedTextColor(card.colorScheme);
  
  const displayTokenId = tokenId || card.tokenId || (isPreview ? "#PREVIEW" : "Not Minted");
  
  return (
    <div className={`nft-card ${gradientClass} rounded-xl overflow-hidden relative card-shadow`}>
      {/* Token ID Badge */}
      <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
        {displayTokenId}
      </div>
      
      <div className="p-6">
        {/* Header: Avatar and Name */}
        <div className="flex items-center mb-4">
          <Avatar className="w-16 h-16 rounded-full mr-3 flex-shrink-0 border-2 border-white/30">
            <AvatarImage 
              src={card.avatarUrl || DEFAULT_AVATAR_URL} 
              alt={`${card.name}'s avatar`} 
              className="w-full h-full object-cover"
            />
            <AvatarFallback className="bg-white/20 text-white text-xl">
              {card.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-heading font-bold text-white text-xl">{card.name}</h3>
            <p className={`${mutedTextClass} font-medium`}>{card.jobTitle}</p>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="text-white/80">
          {card.company && <p className="mb-2">{card.company}</p>}
          {card.bio && <p className="mb-4 text-sm">{card.bio}</p>}
          
          {card.email && (
            <div className="flex items-center text-sm mb-2">
              <span className="material-icons text-sm mr-2">mail</span>
              <span>{card.email}</span>
            </div>
          )}
          
          {card.phone && (
            <div className="flex items-center text-sm">
              <span className="material-icons text-sm mr-2">phone</span>
              <span>{card.phone}</span>
            </div>
          )}
        </div>
        
        {/* Social Links and Actions */}
        <div className="flex mt-4 justify-between">
          <div className="flex space-x-2">
            {card.website && (
              <div className="bg-white/20 p-1.5 rounded-full">
                <span className="material-icons text-white text-lg">language</span>
              </div>
            )}
            
            {card.socialLinks && Object.entries(card.socialLinks).map(([platform, url]) => (
              <div key={platform} className="bg-white/20 p-1.5 rounded-full">
                <span className="material-icons text-white text-lg">{getSocialIcon(platform)}</span>
              </div>
            ))}
            
            {isPreview && (
              <div className="bg-white/20 p-1.5 rounded-full">
                <span className="material-icons text-white text-lg">add</span>
              </div>
            )}
          </div>
          
          {onShare && (
            <button 
              className={`bg-white text-${card.colorScheme.split('-')[0]}-600 rounded-full p-2`} 
              aria-label="Share card"
              onClick={onShare}
            >
              <span className="material-icons">share</span>
            </button>
          )}
          
          {isPreview && (
            <div className="bg-white/20 p-1.5 rounded-full">
              <span className="material-icons text-white text-lg">qr_code</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
