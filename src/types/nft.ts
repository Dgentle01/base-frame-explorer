
export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  collection: {
    id: string;
    name: string;
    imageUrl: string;
  };
  creator: {
    id: string;
    name: string;
    address: string;
    profileImageUrl: string;
  };
  tokenId: string;
  contract: string;
  owner: string;
  mintedAt: string;
  price: {
    amount: string;
    currency: string;
  };
  marketStats: {
    floorPrice: string;
    volume24h: string;
    volumeTotal: string;
    marketCap: string;
  };
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  category: 'Art' | 'Music' | 'Photography' | 'Collectible' | 'Other';
}

export type NFTView = 'grid' | 'list';

export interface NFTFilterOptions {
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  mintDateStart: string | null;
  mintDateEnd: string | null;
  sortBy: 'price' | 'volume' | 'date' | 'marketCap';
  sortDirection: 'asc' | 'desc';
}
