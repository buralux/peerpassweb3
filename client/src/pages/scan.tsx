import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Camera, ExternalLink } from "lucide-react";

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
    const cardId = prompt("Enter card ID to test scanning:");
    if (cardId) {
      onScan(`${window.location.origin}/card/${cardId}`);
    }
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
        <div className="relative w-full max-w-sm aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
          <Camera className="h-24 w-24 text-gray-300" />
          <div className="absolute inset-0 border-2 border-dashed border-gray-400 rounded-lg animate-pulse"></div>
        </div>
      )}
      
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
        Point your camera at a PeerPass QR code to scan
      </p>
      
      <Button onClick={handleTestScan} variant="outline" className="mb-4">
        Test Scan
      </Button>
    </div>
  );
};

const ScanPage: React.FC = () => {
  const { wallet, isConnected } = useWallet();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [scanning, setScanning] = useState(true);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  
  const handleScan = (data: string) => {
    if (data) {
      setScannedUrl(data);
      setScanning(false);
    }
  };
  
  const handleCollectCard = async () => {
    if (!scannedUrl || !wallet?.address) return;
    
    try {
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
  
  if (!isConnected) {
    return (
      <Card className="my-6 text-center">
        <CardHeader>
          <CardTitle>Connect to scan cards</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please connect your wallet to scan and collect business cards.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle className="text-center">Scan Business Card</CardTitle>
      </CardHeader>
      <CardContent>
        {scanning ? (
          <QRScanner onScan={handleScan} />
        ) : (
          <div className="flex flex-col items-center">
            <div className="mb-4 text-center">
              <p className="font-medium text-lg mb-2">Card found!</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm truncate max-w-xs">
                {scannedUrl}
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button onClick={handleCollectCard} className="bg-primary text-white">
                Collect Card
              </Button>
              
              <Button 
                onClick={() => window.open(scannedUrl!, "_blank")} 
                variant="outline"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View
              </Button>
              
              <Button onClick={handleReset} variant="outline">
                Scan Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScanPage;
