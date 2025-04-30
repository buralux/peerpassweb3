import React from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BusinessCard as BusinessCardType } from "@shared/schema";
import ShareCardSection from "@/components/ShareCardSection";
import BusinessCard from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";

const SharePage: React.FC = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  
  // Fetch card details
  const { data: card, isLoading, error } = useQuery<BusinessCardType>({
    queryKey: [`/api/cards/${id}`],
    enabled: !!id,
  });
  
  const handleBack = () => {
    navigate(`/card/${id}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-xl bg-gray-200 dark:bg-gray-700 h-64 w-full max-w-sm mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2.5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2.5"></div>
        </div>
      </div>
    );
  }
  
  if (error || !card) {
    return (
      <Card className="my-6">
        <CardContent className="pt-6">
          <div className="flex mb-4 items-center text-destructive">
            <AlertCircle className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-medium">Error Loading Card</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            We couldn't load the business card. It may have been deleted or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate("/cards")} variant="outline">
            Back to Cards
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="py-6">
      <Button 
        onClick={handleBack} 
        variant="outline" 
        className="mb-6 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Card
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold mb-4">Share This Card</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Share {card.name}'s business card with others via QR code or direct link.
          </p>
          <BusinessCard card={card} />
        </div>
        
        <div>
          <ShareCardSection card={card} />
        </div>
      </div>
    </div>
  );
};

export default SharePage;
