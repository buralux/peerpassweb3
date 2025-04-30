import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/hooks/use-wallet";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatWalletAddress } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { DEFAULT_AVATAR_URL } from "@/lib/constants";
import { ACTIVE_CHAIN } from "@/lib/constants";
import { User } from "@shared/schema";
import { Link } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Exemple d'utilisateur pour le mode démo
const DEMO_USER: User = {
  id: 999,
  username: "Jean Demo",
  walletAddress: "0xdemo123456789abcdef",
  avatarUrl: null,
  createdAt: new Date("2023-01-01"),
};

const ProfilePage: React.FC = () => {
  const { wallet, isConnected, disconnect } = useWallet();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("Jean Demo");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true); // Activer le mode démo par défaut

  // Fetch user data
  const { data: user, isLoading } = useQuery<User>({
    queryKey: wallet?.address ? [`/api/users/wallet/${wallet.address}`] : [],
    enabled: !!wallet?.address && !isDemoMode,
    onSuccess: (data) => {
      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatarUrl || "");
      }
    }
  });

  // Utiliser les données de démo si le wallet n'est pas connecté ou si on est en mode démo
  useEffect(() => {
    if (isDemoMode) {
      setUsername(DEMO_USER.username);
      setAvatarUrl(DEMO_USER.avatarUrl || "");
    }
  }, [isDemoMode]);

  const handleSaveProfile = async () => {
    if (isDemoMode) {
      // Simuler la sauvegarde en mode démo
      setIsSubmitting(true);
      setTimeout(() => {
        toast({
          title: "Demo Profile Updated",
          description: "Your profile has been updated successfully (Demo Mode)"
        });
        setIsSubmitting(false);
        setIsEditing(false);
      }, 1000);
      return;
    }
    
    if (!wallet?.address || !user) return;

    setIsSubmitting(true);
    try {
      await apiRequest("PUT", `/api/users/${user?.id}`, {
        username,
        avatarUrl: avatarUrl || null
      });

      queryClient.invalidateQueries({ queryKey: [`/api/users/wallet/${wallet.address}`] });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisconnect = async () => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode Active",
        description: "In demo mode, disconnection is simulated"
      });
      return;
    }
    
    await disconnect();
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected successfully"
    });
  };

  if (!isConnected && !isDemoMode) {
    return (
      <div className="my-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
        <h2 className="font-heading font-bold text-2xl mb-3 text-gray-800 dark:text-white">
          Connect to View Your Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Please connect your wallet to view and manage your profile.
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

  if (isLoading && !isDemoMode) {
    return (
      <Card className="my-6">
        <CardHeader>
          <CardTitle className="text-center">Loading profile...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="animate-pulse h-48 w-full max-w-md rounded-md bg-gray-200 dark:bg-gray-700"></div>
        </CardContent>
      </Card>
    );
  }

  const displayedUser = isDemoMode ? DEMO_USER : user;
  const displayedWalletAddress = isDemoMode ? DEMO_USER.walletAddress : wallet?.address || "";

  return (
    <div className="py-6">
      {isDemoMode && (
        <Alert className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <span className="material-icons text-amber-500">info</span>
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-300">Mode Démo Actif</h3>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                Vous visualisez un profil de démonstration. La connexion au wallet est temporairement désactivée pour les tests.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
      
      <Card className="mb-6 border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-purple-600 text-white">
          <CardTitle className="text-center text-xl">Votre Profil</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-6">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-75"></div>
            <Avatar className="w-24 h-24 mb-4 border-2 border-white dark:border-gray-800 relative">
              <AvatarImage src={avatarUrl || DEFAULT_AVATAR_URL} alt="Profile picture" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                {username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {isEditing ? (
            <div className="w-full max-w-sm space-y-4 mt-4">
              <div>
                <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">Username</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <span className="material-icons text-sm">person</span>
                  </span>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="avatarUrl" className="text-gray-700 dark:text-gray-300">Avatar URL</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <span className="material-icons text-sm">image</span>
                  </span>
                  <Input
                    id="avatarUrl"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center mt-4">
              <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{username}</h2>
              <div className="inline-flex items-center justify-center px-3 py-1 space-x-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300">
                <span className="material-icons text-sm">account_balance_wallet</span>
                <span>{formatWalletAddress(displayedWalletAddress)}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Network: {ACTIVE_CHAIN.chainName}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center space-x-4 p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          {isEditing ? (
            <>
              <Button 
                onClick={handleSaveProfile} 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="material-icons mr-2">save</span>
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)} 
                disabled={isSubmitting}
                className="border border-gray-300 dark:border-gray-700"
              >
                <span className="material-icons mr-2">close</span>
                <span>Cancel</span>
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="border border-gray-300 dark:border-gray-700"
              >
                <span className="material-icons mr-2">edit</span>
                <span>Edit Profile</span>
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={handleDisconnect}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <span className="material-icons mr-2">logout</span>
                <span>Disconnect</span>
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-primary/10">
            <CardTitle className="text-lg text-gray-800 dark:text-white flex items-center">
              <span className="material-icons mr-2 text-primary">credit_card</span>
              Vos Cartes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600 dark:text-gray-300">
              Gérez et partagez vos cartes de visite NFT
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link href="/cards" className="w-full">
              <Button 
                variant="outline" 
                className="w-full border border-gray-300 dark:border-gray-700 flex items-center justify-center"
              >
                <span className="material-icons mr-2">visibility</span>
                <span>Voir les cartes</span>
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-secondary/10 to-orange-500/10">
            <CardTitle className="text-lg text-gray-800 dark:text-white flex items-center">
              <span className="material-icons mr-2 text-secondary">add_circle</span>
              Nouvelle Carte
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600 dark:text-gray-300">
              Créez et personnalisez une nouvelle carte NFT
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link href="/create" className="w-full">
              <Button 
                className="w-full bg-gradient-to-r from-secondary to-orange-500 hover:opacity-90 text-white flex items-center justify-center"
              >
                <span className="material-icons mr-2">add</span>
                <span>Créer une carte</span>
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
