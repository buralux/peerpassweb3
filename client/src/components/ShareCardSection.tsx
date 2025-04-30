import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BusinessCard as BusinessCardType } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ShareCardSectionProps {
  card: BusinessCardType;
}

const ShareCardSection: React.FC<ShareCardSectionProps> = ({ card }) => {
  const { toast } = useToast();
  const [cardUrl, setCardUrl] = useState<string>("");
  
  useEffect(() => {
    // Generate the card URL
    const baseUrl = window.location.origin;
    setCardUrl(`${baseUrl}/card/${card.id}`);
  }, [card.id]);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(cardUrl);
    toast({
      title: "Link copied",
      description: "Card link has been copied to clipboard",
    });
  };
  
  const handleShare = async (platform: string) => {
    const shareText = `Check out my Web3 business card: ${card.name}, ${card.jobTitle}`;
    
    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + cardUrl)}`);
        break;
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(cardUrl)}&text=${encodeURIComponent(shareText)}`);
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(cardUrl)}`);
        break;
      case "more":
        if (navigator.share) {
          try {
            await navigator.share({
              title: `${card.name}'s Business Card`,
              text: shareText,
              url: cardUrl,
            });
          } catch (error) {
            console.error("Error sharing:", error);
            toast({
              title: "Share failed",
              description: "Could not share the card",
              variant: "destructive",
            });
          }
        } else {
          handleCopyLink();
        }
        break;
      default:
        handleCopyLink();
    }
  };
  
  return (
    <Card className="my-8 bg-white dark:bg-darkSurface rounded-xl overflow-hidden shadow-lg">
      <div className="bg-secondary dark:bg-secondary/80 text-white p-4">
        <h2 className="font-heading font-bold text-xl">Share Your Card</h2>
        <p className="text-white/80 text-sm">Connect with others through your NFT business card</p>
      </div>
      
      <div className="p-6 flex flex-col items-center">
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md inline-block">
            <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <span className="material-icons text-4xl text-gray-500 mb-2">qr_code_2</span>
                <p className="text-sm text-gray-500">QR Code for {card.name}</p>
                <p className="text-xs text-gray-400 mt-1">{cardUrl}</p>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            Scan to view and collect this card
          </p>
        </div>
        
        <div className="w-full max-w-md mb-6">
          <div className="flex">
            <Input 
              type="text" 
              value={cardUrl} 
              className="flex-1 rounded-l-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              readOnly
            />
            <Button
              onClick={handleCopyLink}
              className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-700 border-l-0 rounded-r-lg px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <span className="material-icons">content_copy</span>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-md">
          <Button
            onClick={() => handleShare("whatsapp")} 
            className="flex-1 flex items-center justify-center space-x-2 bg-[#25D366] text-white font-medium py-2 px-4 rounded-lg min-w-[120px]"
          >
            <span className="material-icons">whatsapp</span>
            <span>WhatsApp</span>
          </Button>
          
          <Button
            onClick={() => handleShare("telegram")}
            className="flex-1 flex items-center justify-center space-x-2 bg-[#0088cc] text-white font-medium py-2 px-4 rounded-lg min-w-[120px]"
          >
            <span className="material-icons">telegram</span>
            <span>Telegram</span>
          </Button>
          
          <Button
            onClick={() => handleShare("twitter")}
            className="flex-1 flex items-center justify-center space-x-2 bg-[#1DA1F2] text-white font-medium py-2 px-4 rounded-lg min-w-[120px]"
          >
            <span className="material-icons">twitter</span>
            <span>Twitter</span>
          </Button>
          
          <Button
            onClick={() => handleShare("more")}
            className="flex-1 flex items-center justify-center space-x-2 bg-gray-800 text-white font-medium py-2 px-4 rounded-lg min-w-[120px]"
          >
            <span className="material-icons">more_horiz</span>
            <span>More</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ShareCardSection;
