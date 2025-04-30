import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { BusinessCard as BusinessCardType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import BusinessCard from "@/components/BusinessCard";
import { formatWalletAddress } from "@/lib/utils";
import { AlertCircle, Share2, Download, Trash } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CardDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { wallet, isConnected } = useWallet();
  const { toast } = useToast();
  
  const [showMintDialog, setShowMintDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Fetch card details
  const { data: card, isLoading, error } = useQuery<BusinessCardType>({
    queryKey: [`/api/cards/${id}`],
    enabled: !!id,
  });
  
  // Mint card mutation
  const mintCardMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/cards/${id}/mint`, {});
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/cards/${id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/cards/owner/${wallet?.address}`] });
      
      toast({
        title: "Card minted",
        description: `Your card has been minted with token ID: ${data.tokenId}`,
      });
      
      setShowMintDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Minting failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });
  
  // Delete card mutation
  const deleteCardMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/cards/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cards/owner/${wallet?.address}`] });
      
      toast({
        title: "Card deleted",
        description: "Your business card has been deleted",
      });
      
      navigate("/cards");
    },
    onError: (error) => {
      toast({
        title: "Deletion failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });
  
  const handleShare = () => {
    navigate(`/share/${id}`);
  };
  
  const handleMint = () => {
    setShowMintDialog(true);
  };
  
  const confirmMint = () => {
    mintCardMutation.mutate();
  };
  
  const handleDelete = () => {
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    deleteCardMutation.mutate();
  };
  
  const isOwner = wallet?.address && card?.owner.toLowerCase() === wallet.address.toLowerCase();
  
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
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertCircle className="mr-2 h-5 w-5" />
            Error Loading Card
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>We couldn't load the business card. It may have been deleted or you don't have permission to view it.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate("/cards")} variant="outline">
            Back to Cards
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold mb-2">{card.name}'s Business Card</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {card.isMinted 
            ? `Minted as NFT • Token ID: ${card.tokenId}` 
            : "Not yet minted as NFT"}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
            Owner: {formatWalletAddress(card.owner)}
          </div>
          <div className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
            Template: {card.template}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <BusinessCard card={card} />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                <p>{card.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Title</p>
                <p>{card.jobTitle}</p>
              </div>
              {card.company && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</p>
                  <p>{card.company}</p>
                </div>
              )}
              {card.bio && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</p>
                  <p>{card.bio}</p>
                </div>
              )}
              {card.email && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p>{card.email}</p>
                </div>
              )}
              {card.phone && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                  <p>{card.phone}</p>
                </div>
              )}
              {card.website && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</p>
                  <p className="text-primary truncate">
                    <a href={card.website} target="_blank" rel="noopener noreferrer">
                      {card.website}
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex flex-col gap-3">
            <Button onClick={handleShare} className="flex items-center">
              <Share2 className="mr-2 h-4 w-4" />
              Share Card
            </Button>
            
            {isOwner && !card.isMinted && (
              <Button onClick={handleMint} className="flex items-center bg-primary/90 hover:bg-primary">
                <span className="material-icons mr-2">generating_tokens</span>
                Mint as NFT
              </Button>
            )}
            
            {isOwner && (
              <Button onClick={handleDelete} variant="destructive" className="flex items-center">
                <Trash className="mr-2 h-4 w-4" />
                Delete Card
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mint Dialog */}
      <Dialog open={showMintDialog} onOpenChange={setShowMintDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mint Card as NFT</DialogTitle>
            <DialogDescription>
              This will mint your business card as an NFT on the BNB Chain Testnet.
              Once minted, your card will be permanently stored on the blockchain.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Card Name: {card.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Owner: {formatWalletAddress(card.owner)}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMintDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmMint} 
              disabled={mintCardMutation.isPending}
              className="bg-primary text-white"
            >
              {mintCardMutation.isPending ? "Minting..." : "Confirm Mint"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Business Card</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              business card from our database.
              {card.isMinted && " Note: The NFT will still exist on the blockchain even after deletion."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
              disabled={deleteCardMutation.isPending}
            >
              {deleteCardMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CardDetailsPage;
