
import React from 'react';
import { NFT } from '@/types/nft';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, Tag, BarChart3, ArrowUpRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';

interface NFTDetailProps {
  nft: NFT | null;
  isOpen: boolean;
  onClose: () => void;
}

const NFTDetail: React.FC<NFTDetailProps> = ({ nft, isOpen, onClose }) => {
  const { isConnected } = useWallet();
  const { toast } = useToast();

  if (!nft) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              {nft.name}
              <Badge variant="outline" className={getCategoryColor(nft.category)}>
                {nft.category}
              </Badge>
            </div>
            <Button variant="outline" size="icon" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-square rounded-lg overflow-hidden border border-border">
            <img 
              src={nft.image} 
              alt={nft.name} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src={nft.creator.profileImageUrl}
                alt={nft.creator.name}
                className="w-8 h-8 rounded-full border border-border"
              />
              <div>
                <div className="text-sm text-muted-foreground">Creator</div>
                <div className="font-medium">{nft.creator.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={nft.collection.imageUrl}
                alt={nft.collection.name}
                className="w-8 h-8 rounded-full border border-border"
              />
              <div>
                <div className="text-sm text-muted-foreground">Collection</div>
                <div className="font-medium">{nft.collection.name}</div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Minted</div>
                  <div className="font-medium">{formatDate(nft.mintedAt)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Price</div>
                  <div className="font-medium">{nft.price.amount} {nft.price.currency}</div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Market Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col p-3 bg-muted rounded-md">
                  <span className="text-sm text-muted-foreground">Floor Price</span>
                  <span className="font-medium">{nft.marketStats.floorPrice} ETH</span>
                </div>
                <div className="flex flex-col p-3 bg-muted rounded-md">
                  <span className="text-sm text-muted-foreground">24h Volume</span>
                  <span className="font-medium">{nft.marketStats.volume24h} ETH</span>
                </div>
                <div className="flex flex-col p-3 bg-muted rounded-md">
                  <span className="text-sm text-muted-foreground">Total Volume</span>
                  <span className="font-medium">{nft.marketStats.volumeTotal} ETH</span>
                </div>
                <div className="flex flex-col p-3 bg-muted rounded-md">
                  <span className="text-sm text-muted-foreground">Market Cap</span>
                  <span className="font-medium">{nft.marketStats.marketCap} ETH</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{nft.description}</p>
            </div>

            {nft.attributes.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Attributes</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {nft.attributes.map((attr, idx) => (
                      <div key={idx} className="flex flex-col p-2 bg-muted rounded-md">
                        <span className="text-xs text-muted-foreground">{attr.trait_type}</span>
                        <span className="text-sm font-medium">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <div className="flex gap-4 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button 
              className="flex-1 base-gradient text-white"
              disabled={!isConnected}
              onClick={() => {
                if (!isConnected) {
                  toast({
                    title: "Wallet not connected",
                    description: "Please connect your wallet to purchase NFTs.",
                    variant: "destructive",
                  });
                } else {
                  toast({
                    title: "Purchase initiated",
                    description: `Starting purchase process for ${nft.name}.`,
                  });
                }
              }}
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Purchase for {nft.price.amount} {nft.price.currency}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NFTDetail;
