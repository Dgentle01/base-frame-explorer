
import React from 'react';
import { NFT, NFTView } from '@/types/nft';
import NFTCard from '@/components/NFTCard';
import NFTListCard from '@/components/NFTListCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface NFTGridSectionProps {
  title: string;
  description?: string;
  nfts: NFT[];
  loading?: boolean;
  showViewAll?: boolean;
  onViewAll?: () => void;
  onViewDetails: (id: string) => void;
  view: NFTView;
}

const NFTGridSection: React.FC<NFTGridSectionProps> = ({
  title,
  description,
  nfts,
  loading = false,
  showViewAll = false,
  onViewAll,
  onViewDetails,
  view
}) => {
  if (loading) {
    return (
      <div className="my-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>
        
        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg bg-muted animate-pulse h-[300px]"></div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg bg-muted animate-pulse h-24"></div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="my-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>
        <div className="py-12 text-center bg-muted rounded-lg">
          <p className="text-muted-foreground">No NFTs found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        
        {showViewAll && onViewAll && (
          <Button variant="ghost" onClick={onViewAll} className="group">
            View All
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
      </div>
      
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nfts.map(nft => (
            <NFTCard
              key={nft.id}
              nft={nft}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {nfts.map(nft => (
            <NFTListCard
              key={nft.id}
              nft={nft}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NFTGridSection;
