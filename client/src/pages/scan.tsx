import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Camera, ExternalLink, InfoIcon } from "lucide-react";

// Mock QR scanner component to be replaced with actual QR scanner library
const QRScanner: React.FC<{ onScan: (data: string) => void }> = ({ onScan }) => {
  const [hasCamera, setHasCamera] = useState(true);
  
  useEffect(() => {
    // Check if camera is available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          // Camera available
          setHasCamera(true);
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(() => {
          // Camera not available
          setHasCamera(false);
        });
    } else {
      setHasCamera(false);
    }
  }, []);
  
  // For demo purposes, provide a way to test scanning
  const handleTestScan = () => {
    // Use a sample card ID
    onScan(`${window.location.origin}/card/1`);
  };
  
  return (
    <div className="flex flex-col items-center">
      {!hasCamera ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Camera not available. Please allow camera access or use the test scan button.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="relative w-full max-w-sm aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 z-0"></div>
          <Camera className="h-24 w-24 text-gray-300 z-10 group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 border-2 border-dashed border-gray-400 rounded-lg animate-pulse z-10"></div>
          
          {/* Scanning animation */}
          <div className="absolute top-0 w-full h-1 bg-primary/60 animate-scan z-20"></div>
        </div>
      )}
      
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
        Point your camera at a PeerPass QR code to scan
      </p>
      
      <Button 
        onClick={handleTestScan} 
        className="mb-4 bg-gradient-to-r from-secondary to-orange-500 hover:opacity-90 text-white"
      >
        Test Scan (Demo)
      </Button>
    </div>
  );
};

// Exemple de carte pour le mode démo
const DEMO_CARD = {
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
};

const ScanPage: React.FC = () => {
  const { wallet, isConnected } = useWallet();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [scanning, setScanning] = useState(true);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(true); // Activer le mode démo par défaut
  
  const handleScan = (data: string) => {
    if (data) {
      setScannedUrl(data);
      setScanning(false);
    }
  };
  
  const handleCollectCard = async () => {
    if (!scannedUrl) return;
    
    try {
      if (isDemoMode) {
        // En mode démo, simuler la collecte
        setTimeout(() => {
          toast({
            title: "Demo Card Collected",
            description: "Business card has been added to your demo collection",
          });
          
          navigate(`/cards`);
        }, 1000);
        return;
      }
      
      if (!wallet?.address) return;
      
      // Extract card ID from URL
      const cardId = scannedUrl.split('/card/')[1];
      
      if (!cardId) {
        throw new Error("Invalid QR code");
      }
      
      // Collect the card
      await apiRequest("POST", "/api/collected-cards", {
        cardId: parseInt(cardId),
        collectorAddress: wallet.address,
      });
      
      // Invalidate queries to force a refetch
      queryClient.invalidateQueries({ queryKey: [`/api/collected-cards/${wallet.address}`] });
      
      toast({
        title: "Card collected",
        description: "Business card has been added to your collection",
      });
      
      // Navigate to the card
      navigate(`/card/${cardId}`);
    } catch (error) {
      console.error("Error collecting card:", error);
      toast({
        title: "Error collecting card",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };
  
  const handleReset = () => {
    setScannedUrl(null);
    setScanning(true);
  };
  
  if (!isConnected && !isDemoMode) {
    return (
      <div className="my-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
        <h2 className="font-heading font-bold text-2xl mb-3 text-gray-800 dark:text-white">
          Connect to Scan Cards
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Please connect your wallet to scan and collect business cards.
        </p>
        <Button 
          className="bg-gradient-to-r from-secondary to-orange-500 hover:opacity-90 text-white"
          onClick={() => setIsDemoMode(true)}
        >
          <span className="material-icons mr-2">visibility</span>
          Try Demo Mode
        </Button>
      </div>
    );
  }
  
  return (
    <div className="my-6">
      {isDemoMode && (
        <Alert className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <span className="material-icons text-amber-500">info</span>
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-300">Mode Démo Actif</h3>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                Vous utilisez le scanner en mode démo. Cliquez sur "Test Scan" pour simuler la numérisation d'une carte.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
      
      <Card className="border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-purple-600 text-white">
          <CardTitle className="text-center text-xl">Scan Business Card</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {scanning ? (
            <QRScanner onScan={handleScan} />
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <span className="material-icons text-green-600 dark:text-green-400 text-2xl">check_circle</span>
                </div>
                <p className="font-medium text-xl mb-2">Card Found!</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm truncate max-w-xs">
                  {scannedUrl}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleCollectCard} 
                  className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white"
                >
                  <span className="material-icons mr-2">add_circle</span>
                  Collect Card
                </Button>
                
                <Button 
                  onClick={() => window.open(scannedUrl!, "_blank")} 
                  variant="outline"
                  className="border border-gray-300 dark:border-gray-700"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Card
                </Button>
                
                <Button 
                  onClick={handleReset} 
                  variant="outline"
                  className="border border-gray-300 dark:border-gray-700"
                >
                  <span className="material-icons mr-2">refresh</span>
                  Scan Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          50.1% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ScanPage;
