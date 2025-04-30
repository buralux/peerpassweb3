import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/hooks/use-wallet";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardSection from "@/components/CardSection";
import CollectedCardsSection from "@/components/CollectedCardsSection";
import { BusinessCard } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Exemples de cartes pour le mode démo
const DEMO_CARDS: BusinessCard[] = [
  {
    id: 1,
    tokenId: "DEMO-001",
    owner: "0xdemoAddress1",
    name: "Jean Dupont",
    jobTitle: "Développeur Web3",
    company: "BlockchainTech",
    bio: "Développeur passionné par les technologies blockchain et le web décentralisé.",
    email: "jean@example.com",
    phone: "+33 6 12 34 56 78",
    website: "https://jeandupont.xyz",
    template: "professional",
    colorScheme: "blue-violet",
    avatarUrl: null,
    socialLinks: {"linkedin": "https://linkedin.com/in/jeandupont", "twitter": "https://twitter.com/jeandupont"},
    metadata: {},
    ipfsHash: "ipfs://QmDemo1",
    isMinted: true,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: 2,
    tokenId: "DEMO-002",
    owner: "0xdemoAddress1",
    name: "Sophie Martin",
    jobTitle: "Designer UX/UI",
    company: "CryptoDesign",
    bio: "Designer spécialisée dans les interfaces pour applications Web3 et DeFi.",
    email: "sophie@example.com",
    phone: "+33 6 98 76 54 32",
    website: "https://sophiedesign.fr",
    template: "creative",
    colorScheme: "purple-pink",
    avatarUrl: null,
    socialLinks: {"dribbble": "https://dribbble.com/sophiedesign", "behance": "https://behance.net/sophiedesign"},
    metadata: {},
    ipfsHash: "ipfs://QmDemo2",
    isMinted: true,
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-02-20"),
  },
];

const DEMO_COLLECTED_CARDS: BusinessCard[] = [
  {
    id: 3,
    tokenId: "DEMO-003",
    owner: "0xdemoAddress2",
    name: "Marc Leblanc",
    jobTitle: "Investment Advisor",
    company: "Crypto Capital",
    bio: "Conseiller en investissements spécialisé dans les actifs numériques et la DeFi.",
    email: "marc@example.com",
    phone: "+33 6 45 67 89 01",
    website: "https://cryptocapital.fr",
    template: "professional",
    colorScheme: "teal-emerald",
    avatarUrl: null,
    socialLinks: {"linkedin": "https://linkedin.com/in/marcleblanc"},
    metadata: {},
    ipfsHash: "ipfs://QmDemo3",
    isMinted: true,
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-03-10"),
  },
];

const CardsPage: React.FC = () => {
  const { wallet, isConnected } = useWallet();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("yours");
  const [isDemoMode, setIsDemoMode] = useState(true); // Activer le mode démo par défaut
  
  // Fetch user's cards
  const { data: userCards = [], isLoading: isLoadingUserCards } = useQuery<BusinessCard[]>({
    queryKey: wallet?.address ? [`/api/cards/owner/${wallet.address}`] : [],
    enabled: !!wallet?.address && !isDemoMode,
  });
  
  // Fetch collected cards
  const { data: collectedCards = [], isLoading: isLoadingCollectedCards } = useQuery<BusinessCard[]>({
    queryKey: wallet?.address ? [`/api/collected-cards/${wallet.address}`] : [],
    enabled: !!wallet?.address && !isDemoMode,
  });
  
  const handleCreateCard = () => {
    navigate("/create");
  };
  
  const handleShareCard = (card: BusinessCard) => {
    navigate(`/share/${card.id}`);
  };
  
  // Utiliser des données de démo si le wallet n'est pas connecté ou en mode démo
  const displayedUserCards = isDemoMode ? DEMO_CARDS : userCards;
  const displayedCollectedCards = isDemoMode ? DEMO_COLLECTED_CARDS : collectedCards;
  
  if (!isConnected && !isDemoMode) {
    return (
      <div className="my-6 p-6 bg-white dark:bg-darkSurface rounded-xl shadow-md text-center">
        <h2 className="font-heading font-bold text-2xl mb-3 text-gray-800 dark:text-white">
          Connect to view your cards
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Please connect your wallet to view your business cards.
        </p>
        <Button 
          className="bg-gradient-to-r from-secondary to-orange-500 hover:opacity-90 text-white"
          onClick={() => setIsDemoMode(true)}
        >
          <span className="material-icons mr-2">visibility</span>
          Explore in Demo Mode
        </Button>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      {isDemoMode && (
        <Alert className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <span className="material-icons text-amber-500">info</span>
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-300">Mode Démo Actif</h3>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                Vous visualisez des cartes de démonstration. La connexion au wallet est temporairement désactivée pour les tests.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
      
      <Tabs defaultValue="yours" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="yours" className="flex-1">Your Cards</TabsTrigger>
          <TabsTrigger value="collected" className="flex-1">Collected Cards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="yours">
          <CardSection
            title="Your Cards"
            cards={displayedUserCards}
            showCreateButton={true}
            onCreateCard={handleCreateCard}
            onShare={handleShareCard}
            emptyStateMessage="You haven't created any cards yet"
          />
        </TabsContent>
        
        <TabsContent value="collected">
          <CollectedCardsSection
            cards={displayedCollectedCards}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center">
        <Button 
          onClick={handleCreateCard}
          className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white"
        >
          <span className="material-icons mr-2">add_circle</span>
          Create New Card
        </Button>
      </div>
    </div>
  );
};

export default CardsPage;
