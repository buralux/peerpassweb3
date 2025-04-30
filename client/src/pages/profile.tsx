import React, { useState } from "react";
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

const ProfilePage: React.FC = () => {
  const { wallet, isConnected, disconnect } = useWallet();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user data
  const { data: user, isLoading } = useQuery<User>({
    queryKey: wallet?.address ? [`/api/users/wallet/${wallet.address}`] : [],
    enabled: !!wallet?.address,
    onSuccess: (data) => {
      setUsername(data.username);
      setAvatarUrl(data.avatarUrl || "");
    }
  });

  const handleSaveProfile = async () => {
    if (!wallet?.address) return;

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
    await disconnect();
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected successfully"
    });
  };

  if (!isConnected) {
    return (
      <Card className="my-6 text-center">
        <CardHeader>
          <CardTitle>Connect your wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please connect your wallet to view and manage your profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
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

  return (
    <div className="py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-center">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={avatarUrl || DEFAULT_AVATAR_URL} alt="Profile picture" />
            <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          {isEditing ? (
            <div className="w-full max-w-sm space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </div>
              <div>
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-bold mb-1">{username}</h2>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="material-icons text-sm">account_balance_wallet</span>
                <span>{formatWalletAddress(wallet?.address || "")}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Network: {ACTIVE_CHAIN.chainName}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          {isEditing ? (
            <>
              <Button onClick={handleSaveProfile} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
              <Button variant="destructive" onClick={handleDisconnect}>
                Disconnect Wallet
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your created NFT business cards
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/cards">
              <Button variant="outline" className="w-full">View Cards</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create New Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Design and mint a new NFT business card
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/create">
              <Button className="w-full bg-primary text-white">Create Card</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
