
import React, { useState } from 'react';
import { NFT } from '@/types/nft';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ArrowUpRight, Info, CheckCircle } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { toast } from '@/hooks/use-toast';

interface NFTCardProps {
  nft: NFT;
  onViewDetails: (id: string) => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onViewDetails }) => {
  const { isConnected, provider } = useWallet();
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: `${nft.name} has been ${isLiked ? "removed from" : "added to"} your favorites.`,
      duration: 3000,
    });
  };

  const handleBuyNFT = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase NFTs.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsPurchasing(true);
      
      // Simulate transaction processing
      toast({
        title: "Processing purchase",
        description: `Initiating purchase of ${nft.name}...`,
      });
      
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful purchase
      setIsPurchased(true);
      setIsPurchasing(false);
      
      toast({
        title: "Purchase successful!",
        description: `You've successfully purchased ${nft.name}. It will appear in your wallet shortly.`,
      });
    } catch (error) {
      console.error("Purchase error:", error);
      setIsPurchasing(false);
      
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Art':
        return 'text-nft-art bg-nft-art/10';
      case 'Music':
        return 'text-nft-music bg-nft-music/10';
      case 'Photography':
        return 'text-nft-photography bg-nft-photography/10';
      case 'Collectible':
        return 'text-nft-collectible bg-nft-collectible/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <Card 
      className={`nft-card overflow-hidden transition-all duration-300 h-full ${isHovered ? 'animate-glow' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={nft.image} 
          alt={nft.name} 
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <button 
            onClick={handleLike}
            className={`p-2 rounded-full bg-background/80 backdrop-blur-sm transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-primary'}`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/80 to-transparent">
          <div className="flex items-center gap-2">
            <img
              src={nft.creator.profileImageUrl}
              alt={nft.creator.name}
              className="w-6 h-6 rounded-full border border-border"
            />
            <span className="text-xs font-medium truncate">{nft.creator.name}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold truncate">{nft.name}</h3>
          <Badge variant="outline" className={getCategoryColor(nft.category)}>
            {nft.category}
          </Badge>
        </div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Price</span>
            <span className="font-medium">{nft.price.amount} {nft.price.currency}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Minted</span>
            <span className="text-sm">{formatDate(nft.mintedAt)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col p-2 bg-muted rounded-md">
            <span className="text-muted-foreground">Floor</span>
            <span className="font-medium">{nft.marketStats.floorPrice} ETH</span>
          </div>
          <div className="flex flex-col p-2 bg-muted rounded-md">
            <span className="text-muted-foreground">24h Vol</span>
            <span className="font-medium">{nft.marketStats.volume24h} ETH</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewDetails(nft.id)}
          >
            <Info className="h-4 w-4 mr-2" />
            Details
          </Button>
          {isPurchased ? (
            <Button 
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              disabled
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Owned
            </Button>
          ) : (
            <Button 
              className="flex-1 base-gradient text-white"
              disabled={!isConnected || isPurchasing}
              onClick={handleBuyNFT}
            >
              {isPurchasing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </span>
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Buy
                </>
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default NFTCard;
