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
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

// Exemples de cartes de visite pour le mode démo
const DEMO_CARDS: BusinessCard[] = [
  {
    id: 1,
    owner: "0xDemoAddress1",
    tokenId: "demo-token-1",
    name: "John Doe",
    jobTitle: "Product Manager",
    company: "TechCorp",
    email: "john@example.com",
    phone: "+33 6 12 34 56 78",
    website: "https://johndoe.example.com",
    bio: "Experienced product manager specializing in SaaS products.",
    template: "professional",
    colorScheme: "blue-violet",
    avatarUrl: null,
    socialLinks: {},
    metadata: {},
    ipfsHash: null,
    isMinted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    owner: "0xDemoAddress1",
    tokenId: "demo-token-2",
    name: "Marie Dupont",
    jobTitle: "UX Designer",
    company: "DesignStudio",
    email: "marie@example.com",
    phone: "+33 6 98 76 54 32",
    website: "https://mariedesigns.example.com",
    bio: "Creative UX/UI designer with expertise in mobile applications.",
    template: "creative",
    colorScheme: "teal-emerald",
    avatarUrl: null,
    socialLinks: {},
    metadata: {},
    ipfsHash: null,
    isMinted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    owner: "0xDemoAddress1",
    tokenId: "demo-token-4",
    name: "MOHAMED AZIZI",
    jobTitle: "PURCHASE MANAGER",
    company: "Omari Construction",
    email: "mohamed@omari-construction.ma",
    phone: "+212 661 23 45 67",
    website: "https://omari-construction.ma",
    bio: "Responsable des achats et de l'approvisionnement avec plus de 15 ans d'expérience dans le secteur de la construction.",
    template: "omari",
    colorScheme: "gold-black",
    avatarUrl: null,
    socialLinks: {
      linkedin: "https://linkedin.com/in/mohamed-azizi",
      twitter: "https://twitter.com/omari_construction"
    },
    metadata: {},
    ipfsHash: null,
    isMinted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const DEMO_COLLECTED_CARDS: BusinessCard[] = [
  {
    id: 3,
    owner: "0xDemoAddress2",
    tokenId: "demo-token-3",
    name: "Pierre Martin",
    jobTitle: "Blockchain Developer",
    company: "Web3 Solutions",
    email: "pierre@example.com",
    phone: "+33 7 11 22 33 44",
    website: "https://pierreblockchain.example.com",
    bio: "Blockchain specialist with experience in Ethereum and BNB Chain.",
    template: "bold",
    colorScheme: "amber-red",
    avatarUrl: null,
    socialLinks: {},
    metadata: {},
    ipfsHash: null,
    isMinted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    owner: "0xDemoAddress3",
    tokenId: "demo-token-5",
    name: "Karim Omari",
    jobTitle: "Directeur Technique",
    company: "Omari Construction",
    email: "karim@omari-construction.ma",
    phone: "+212 661 98 76 54",
    website: "https://omari-construction.ma",
    bio: "Ingénieur en génie civil avec expertise en projets d'infrastructure. Responsable du développement technique et innovation de l'entreprise.",
    template: "omari",
    colorScheme: "gold-black",
    avatarUrl: null,
    socialLinks: {
      linkedin: "https://linkedin.com/in/karim-omari",
      twitter: "https://twitter.com/karim_omari"
    },
    metadata: {},
    ipfsHash: null,
    isMinted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const HomePage: React.FC = () => {
  const { wallet, connect, isConnected } = useWallet();
  const [, navigate] = useLocation();
  const [demoMode, setDemoMode] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Fetch user's cards
  const { data: userCards = [], isLoading: isLoadingUserCards } = useQuery<BusinessCard[]>({
    queryKey: wallet?.address ? [`/api/cards/owner/${wallet.address}`] : [],
    enabled: !!wallet?.address && !demoMode,
  });
  
  // Fetch collected cards
  const { data: collectedCards = [], isLoading: isLoadingCollectedCards } = useQuery<BusinessCard[]>({
    queryKey: wallet?.address ? [`/api/collected-cards/${wallet.address}`] : [],
    enabled: !!wallet?.address && !demoMode,
  });
  
  const handleConnectWallet = async () => {
    try {
      await connect("injected");
    } catch (error) {
      console.log("Error connecting wallet:", error);
      // L'erreur est déjà gérée par le hook useWallet
      
      toast({
        title: t('errors.walletNotConnected'),
        description: t('errors.connectionError'),
        variant: "destructive",
      });
    }
  };
  
  const handleLearnMore = () => {
    window.open("https://www.bnbchain.org/en", "_blank");
  };
  
  const handleEnterDemoMode = () => {
    setDemoMode(true);
    toast({
      title: t('common.demoActivated'),
      description: t('common.demoDescription'),
    });
  };
  
  const handleCreateCard = () => {
    navigate("/create");
  };
  
  const handleShareCard = (card: BusinessCard) => {
    navigate(`/share/${card.id}`);
  };
  
  if (!isConnected && !demoMode) {
    return (
      <OnboardingSection 
        onConnect={handleConnectWallet} 
        onLearnMore={handleLearnMore}
        onDemoMode={handleEnterDemoMode}
      />
    );
  }
  
  const displayedCards = demoMode ? DEMO_CARDS : userCards;
  const displayedCollectedCards = demoMode ? DEMO_COLLECTED_CARDS : collectedCards;
  const displayAddress = demoMode ? "0xDemo...1234" : (wallet?.address ? formatWalletAddress(wallet.address) : "");
  
  return (
    <>
      {demoMode && (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="material-icons">info</span>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                {t('common.demoModeActive')}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <DashboardStats
        cardCount={displayedCards.length}
        collectedCount={displayedCollectedCards.length}
        chainName={demoMode ? t('common.demoMode') : ACTIVE_CHAIN.chainName}
        walletAddress={displayAddress}
      />
      
      <CardSection
        title={t('cards.myCards')}
        cards={displayedCards}
        showCreateButton={true}
        onCreateCard={handleCreateCard}
        onShare={handleShareCard}
        emptyStateMessage={t('cards.emptyState')}
      />
      
      <CollectedCardsSection
        cards={displayedCollectedCards}
      />
    </>
  );
};

export default HomePage;
