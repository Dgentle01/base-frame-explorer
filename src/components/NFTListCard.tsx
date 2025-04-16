
import React, { useState } from 'react';
import { NFT } from '@/types/nft';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, ArrowUpRight, CheckCircle } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { toast } from '@/hooks/use-toast';

interface NFTListCardProps {
  nft: NFT;
  onViewDetails: (id: string) => void;
}

const NFTListCard: React.FC<NFTListCardProps> = ({ nft, onViewDetails }) => {
  const { isConnected } = useWallet();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row w-full">
          <div className="relative w-full sm:w-24 h-24">
            <img 
              src={nft.image} 
              alt={nft.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{nft.name}</h3>
                  <Badge variant="outline" className={getCategoryColor(nft.category)}>
                    {nft.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <img
                    src={nft.creator.profileImageUrl}
                    alt={nft.creator.name}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="text-xs text-muted-foreground">{nft.creator.name}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">Minted {formatDate(nft.mintedAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col sm:items-end">
                  <span className="text-xs text-muted-foreground">Price</span>
                  <span className="font-medium">{nft.price.amount} {nft.price.currency}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
              <div className="flex gap-2 text-xs">
                <div className="flex gap-1 items-center">
                  <span className="text-muted-foreground">Floor:</span>
                  <span className="font-medium">{nft.marketStats.floorPrice} ETH</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="text-muted-foreground">24h Vol:</span>
                  <span className="font-medium">{nft.marketStats.volume24h} ETH</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="text-muted-foreground">Market Cap:</span>
                  <span className="font-medium">{nft.marketStats.marketCap} ETH</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewDetails(nft.id)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Details
                </Button>
                
                {isPurchased ? (
                  <Button 
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    disabled
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Owned
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    className="base-gradient text-white"
                    disabled={!isConnected || isPurchasing}
                    onClick={handleBuyNFT}
                  >
                    {isPurchasing ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing
                      </span>
                    ) : (
                      <>
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        Buy
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTListCard;
