import React, { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/hooks/use-wallet";
import { formatWalletAddress, getGradientClass } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ACTIVE_CHAIN } from "@/lib/constants";
import OnboardingSection from "@/components/OnboardingSection";
import DashboardStats from "@/components/DashboardStats";
import CardSection from "@/components/CardSection";
import CollectedCardsSection from "@/components/CollectedCardsSection";
import { BusinessCard } from "@shared/schema";

const HomePage: React.FC = () => {
  const { wallet, connect, isConnected } = useWallet();
  const [, navigate] = useLocation();
  
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
  
  const handleConnectWallet = async () => {
    await connect("injected");
  };
  
  const handleLearnMore = () => {
    window.open("https://www.bnbchain.org/en", "_blank");
  };
  
  const handleCreateCard = () => {
    navigate("/create");
  };
  
  const handleShareCard = (card: BusinessCard) => {
    navigate(`/share/${card.id}`);
  };
  
  if (!isConnected) {
    return <OnboardingSection onConnect={handleConnectWallet} onLearnMore={handleLearnMore} />;
  }
  
  return (
    <>
      <DashboardStats
        cardCount={userCards.length}
        collectedCount={collectedCards.length}
        chainName={ACTIVE_CHAIN.chainName}
        walletAddress={wallet?.address ? formatWalletAddress(wallet.address) : ""}
      />
      
      <CardSection
        title="Your Cards"
        cards={userCards}
        showCreateButton={true}
        onCreateCard={handleCreateCard}
        onShare={handleShareCard}
        emptyStateMessage="You haven't created any cards yet"
      />
      
      <CollectedCardsSection
        cards={collectedCards}
      />
    </>
  );
};

export default HomePage;
