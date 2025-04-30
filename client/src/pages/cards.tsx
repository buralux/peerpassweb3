import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/hooks/use-wallet";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardSection from "@/components/CardSection";
import CollectedCardsSection from "@/components/CollectedCardsSection";
import { BusinessCard } from "@shared/schema";
import { Button } from "@/components/ui/button";

const CardsPage: React.FC = () => {
  const { wallet, isConnected } = useWallet();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("yours");
  
  // Fetch user's cards
  const { data: userCards = [], isLoading: isLoadingUserCards } = useQuery<BusinessCard[]>({
    queryKey: wallet?.address ? [`/api/cards/owner/${wallet.address}`] : [],
    enabled: !!wallet?.address,
  });
  
  // Fetch collected cards
  const { data: collectedCards = [], isLoading: isLoadingCollectedCards } = useQuery<BusinessCard[]>({
    queryKey: wallet?.address ? [`/api/collected-cards/${wallet.address}`] : [],
    enabled: !!wallet?.address,
  });
  
  const handleCreateCard = () => {
    navigate("/create");
  };
  
  const handleShareCard = (card: BusinessCard) => {
    navigate(`/share/${card.id}`);
  };
  
  if (!isConnected) {
    return (
      <div className="my-6 p-6 bg-white dark:bg-darkSurface rounded-xl shadow-md text-center">
        <h2 className="font-heading font-bold text-2xl mb-3 text-gray-800 dark:text-white">
          Connect to view your cards
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Please connect your wallet to view your business cards.
        </p>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <Tabs defaultValue="yours" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="yours" className="flex-1">Your Cards</TabsTrigger>
          <TabsTrigger value="collected" className="flex-1">Collected Cards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="yours">
          <CardSection
            title="Your Cards"
            cards={userCards}
            showCreateButton={true}
            onCreateCard={handleCreateCard}
            onShare={handleShareCard}
            emptyStateMessage="You haven't created any cards yet"
          />
        </TabsContent>
        
        <TabsContent value="collected">
          <CollectedCardsSection
            cards={collectedCards}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center">
        <Button 
          onClick={handleCreateCard}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <span className="material-icons mr-2">add_circle</span>
          Create New Card
        </Button>
      </div>
    </div>
  );
};

export default CardsPage;
