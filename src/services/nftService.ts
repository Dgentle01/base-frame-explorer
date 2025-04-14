
import { NFT, NFTFilterOptions } from '@/types/nft';

// Mock data for development
const mockNFTs: NFT[] = [
  {
    id: '1',
    name: 'Cosmic Voyager #42',
    description: 'A journey through the cosmos on the Base network.',
    image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?q=80&w=1932&auto=format&fit=crop',
    collection: {
      id: 'cosmic-voyagers',
      name: 'Cosmic Voyagers',
      imageUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=1974&auto=format&fit=crop',
    },
    creator: {
      id: 'creator1',
      name: 'Stellar Studio',
      address: '0x1234...5678',
      profileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop',
    },
    tokenId: '42',
    contract: '0xabcd...1234',
    owner: '0x9876...5432',
    mintedAt: '2023-09-15T10:30:00Z',
    price: {
      amount: '0.42',
      currency: 'ETH',
    },
    marketStats: {
      floorPrice: '0.38',
      volume24h: '12.5',
      volumeTotal: '420',
      marketCap: '1680',
    },
    attributes: [
      { trait_type: 'Background', value: 'Deep Space' },
      { trait_type: 'Rarity', value: 'Rare' },
    ],
    category: 'Art',
  },
  {
    id: '2',
    name: 'Digital Symphony #7',
    description: 'A musical journey encoded as a visual masterpiece.',
    image: 'https://images.unsplash.com/photo-1558865869-c93f6f8482af?q=80&w=2081&auto=format&fit=crop',
    collection: {
      id: 'digital-symphony',
      name: 'Digital Symphony',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    },
    creator: {
      id: 'creator2',
      name: 'Harmonic Labs',
      address: '0x2345...6789',
      profileImageUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1780&auto=format&fit=crop',
    },
    tokenId: '7',
    contract: '0xbcde...2345',
    owner: '0xa987...6543',
    mintedAt: '2023-10-10T14:20:00Z',
    price: {
      amount: '0.77',
      currency: 'ETH',
    },
    marketStats: {
      floorPrice: '0.55',
      volume24h: '8.2',
      volumeTotal: '320',
      marketCap: '2240',
    },
    attributes: [
      { trait_type: 'Instrument', value: 'Synthesizer' },
      { trait_type: 'Tempo', value: 'Allegro' },
    ],
    category: 'Music',
  },
  {
    id: '3',
    name: 'Quantum Realm #128',
    description: 'A glimpse into the quantum fabric of reality.',
    image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1974&auto=format&fit=crop',
    collection: {
      id: 'quantum-realm',
      name: 'Quantum Realm',
      imageUrl: 'https://images.unsplash.com/photo-1534330207526-8e81f10ec6fc?q=80&w=2070&auto=format&fit=crop',
    },
    creator: {
      id: 'creator3',
      name: 'Particle Vision',
      address: '0x3456...7890',
      profileImageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
    },
    tokenId: '128',
    contract: '0xcdef...3456',
    owner: '0xb098...7654',
    mintedAt: '2023-11-05T09:15:00Z',
    price: {
      amount: '1.28',
      currency: 'ETH',
    },
    marketStats: {
      floorPrice: '1.15',
      volume24h: '24.3',
      volumeTotal: '860',
      marketCap: '4480',
    },
    attributes: [
      { trait_type: 'Dimension', value: 'Multiverse' },
      { trait_type: 'Particle', value: 'Entangled' },
    ],
    category: 'Art',
  },
  {
    id: '4',
    name: 'Urban Perspectives #15',
    description: 'Capturing city life through an artistic lens.',
    image: 'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?q=80&w=1780&auto=format&fit=crop',
    collection: {
      id: 'urban-perspectives',
      name: 'Urban Perspectives',
      imageUrl: 'https://images.unsplash.com/photo-1531265726475-52ad60219627?q=80&w=1976&auto=format&fit=crop',
    },
    creator: {
      id: 'creator4',
      name: 'CityCapture',
      address: '0x4567...8901',
      profileImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop',
    },
    tokenId: '15',
    contract: '0xdefg...4567',
    owner: '0xc109...8765',
    mintedAt: '2023-12-01T16:45:00Z',
    price: {
      amount: '0.35',
      currency: 'ETH',
    },
    marketStats: {
      floorPrice: '0.32',
      volume24h: '5.8',
      volumeTotal: '210',
      marketCap: '1050',
    },
    attributes: [
      { trait_type: 'Location', value: 'Metropolis' },
      { trait_type: 'Time', value: 'Dusk' },
    ],
    category: 'Photography',
  },
  {
    id: '5',
    name: 'Base Champions #23',
    description: 'The digital collectibles of Base network heroes.',
    image: 'https://images.unsplash.com/photo-1635468872214-8d36eb0ab3b9?q=80&w=1742&auto=format&fit=crop',
    collection: {
      id: 'base-champions',
      name: 'Base Champions',
      imageUrl: 'https://images.unsplash.com/photo-1633009053379-c8ea55a17842?q=80&w=1932&auto=format&fit=crop',
    },
    creator: {
      id: 'creator5',
      name: 'Base Foundry',
      address: '0x5678...9012',
      profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    },
    tokenId: '23',
    contract: '0xefgh...5678',
    owner: '0xd210...9876',
    mintedAt: '2024-01-10T11:30:00Z',
    price: {
      amount: '0.89',
      currency: 'ETH',
    },
    marketStats: {
      floorPrice: '0.75',
      volume24h: '15.2',
      volumeTotal: '620',
      marketCap: '3100',
    },
    attributes: [
      { trait_type: 'Role', value: 'Guardian' },
      { trait_type: 'Power', value: 'Legendary' },
    ],
    category: 'Collectible',
  },
  {
    id: '6',
    name: 'Ethereal Landscapes #56',
    description: 'Dreamlike landscapes from another dimension.',
    image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1974&auto=format&fit=crop',
    collection: {
      id: 'ethereal-landscapes',
      name: 'Ethereal Landscapes',
      imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop',
    },
    creator: {
      id: 'creator6',
      name: 'Dreamscape',
      address: '0x6789...0123',
      profileImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop',
    },
    tokenId: '56',
    contract: '0xfghi...6789',
    owner: '0xe321...0987',
    mintedAt: '2024-02-20T08:40:00Z',
    price: {
      amount: '0.56',
      currency: 'ETH',
    },
    marketStats: {
      floorPrice: '0.49',
      volume24h: '9.7',
      volumeTotal: '380',
      marketCap: '1900',
    },
    attributes: [
      { trait_type: 'World', value: 'Nebula' },
      { trait_type: 'Flora', value: 'Bioluminescent' },
    ],
    category: 'Art',
  },
];

// Helper function to delay responses to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const nftService = {
  // Get trending NFTs
  async getTrendingNFTs(): Promise<NFT[]> {
    await delay(800);
    return mockNFTs.sort((a, b) => 
      parseFloat(b.marketStats.volume24h) - parseFloat(a.marketStats.volume24h)
    ).slice(0, 4);
  },

  // Get newly minted NFTs
  async getNewlyMintedNFTs(): Promise<NFT[]> {
    await delay(600);
    return mockNFTs.sort((a, b) => 
      new Date(b.mintedAt).getTime() - new Date(a.mintedAt).getTime()
    ).slice(0, 4);
  },

  // Get highest market cap NFTs
  async getHighestMarketCapNFTs(): Promise<NFT[]> {
    await delay(700);
    return mockNFTs.sort((a, b) => 
      parseFloat(b.marketStats.marketCap) - parseFloat(a.marketStats.marketCap)
    ).slice(0, 4);
  },

  // Search NFTs with optional filters
  async searchNFTs(query: string, filters?: NFTFilterOptions): Promise<NFT[]> {
    await delay(500);
    
    let filteredNFTs = mockNFTs.filter(nft => 
      nft.name.toLowerCase().includes(query.toLowerCase()) ||
      nft.creator.name.toLowerCase().includes(query.toLowerCase()) ||
      nft.collection.name.toLowerCase().includes(query.toLowerCase())
    );

    // Apply filters if provided
    if (filters) {
      if (filters.category) {
        filteredNFTs = filteredNFTs.filter(nft => 
          nft.category === filters.category
        );
      }

      if (filters.minPrice !== null) {
        filteredNFTs = filteredNFTs.filter(nft => 
          parseFloat(nft.price.amount) >= (filters.minPrice || 0)
        );
      }

      if (filters.maxPrice !== null) {
        filteredNFTs = filteredNFTs.filter(nft => 
          parseFloat(nft.price.amount) <= (filters.maxPrice || Infinity)
        );
      }

      if (filters.mintDateStart) {
        const startDate = new Date(filters.mintDateStart);
        filteredNFTs = filteredNFTs.filter(nft => 
          new Date(nft.mintedAt) >= startDate
        );
      }

      if (filters.mintDateEnd) {
        const endDate = new Date(filters.mintDateEnd);
        filteredNFTs = filteredNFTs.filter(nft => 
          new Date(nft.mintedAt) <= endDate
        );
      }

      // Sort results
      if (filters.sortBy) {
        filteredNFTs.sort((a, b) => {
          let valueA, valueB;
          
          switch (filters.sortBy) {
            case 'price':
              valueA = parseFloat(a.price.amount);
              valueB = parseFloat(b.price.amount);
              break;
            case 'volume':
              valueA = parseFloat(a.marketStats.volume24h);
              valueB = parseFloat(b.marketStats.volume24h);
              break;
            case 'marketCap':
              valueA = parseFloat(a.marketStats.marketCap);
              valueB = parseFloat(b.marketStats.marketCap);
              break;
            case 'date':
              valueA = new Date(a.mintedAt).getTime();
              valueB = new Date(b.mintedAt).getTime();
              break;
            default:
              return 0;
          }
          
          return filters.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        });
      }
    }

    return filteredNFTs;
  },

  // Get NFT by ID
  async getNFTById(id: string): Promise<NFT | null> {
    await delay(300);
    const nft = mockNFTs.find(nft => nft.id === id);
    return nft || null;
  },

  // Get NFT suggestions for autocomplete
  async getNFTSuggestions(query: string): Promise<string[]> {
    await delay(200);
    if (!query || query.length < 2) return [];
    
    const lowercaseQuery = query.toLowerCase();
    const nftNames = mockNFTs
      .filter(nft => nft.name.toLowerCase().includes(lowercaseQuery))
      .map(nft => nft.name);
    
    const creatorNames = mockNFTs
      .filter(nft => nft.creator.name.toLowerCase().includes(lowercaseQuery))
      .map(nft => nft.creator.name);
    
    // Combine and remove duplicates
    return [...new Set([...nftNames, ...creatorNames])].slice(0, 5);
  }
};
