
import { toast } from "@/hooks/use-toast";

// Zora API base URL
const ZORA_API_URL = "https://api.zora.co";

// API key for Zora (to be provided by the user)
const ZORA_API_KEY = import.meta.env.VITE_ZORA_API_KEY || "";

export type ZoraNFT = {
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
  attributes: {
    trait_type: string;
    value: string;
  }[];
  category: string;
};

// Function to get NFTs from Zora
export const getZoraNFTs = async (limit = 10): Promise<ZoraNFT[]> => {
  // Check if API key is available
  if (!ZORA_API_KEY) {
    console.warn("Zora API key is not configured. Using mock data instead.");
    return getMockNFTs();
  }

  try {
    const response = await fetch(`${ZORA_API_URL}/v1/collections?limit=${limit}`, {
      headers: {
        "Accept": "application/json",
        "X-API-KEY": ZORA_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Zora API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return transformZoraResponse(data);
  } catch (error) {
    console.error("Error fetching Zora NFTs:", error);
    toast({
      title: "Error",
      description: "Failed to fetch Zora NFTs. Using mock data instead.",
      variant: "destructive",
    });
    return getMockNFTs();
  }
};

// Function to get NFT details from Zora
export const getZoraNFTDetails = async (id: string): Promise<ZoraNFT | null> => {
  // Check if API key is available
  if (!ZORA_API_KEY) {
    console.warn("Zora API key is not configured. Using mock data instead.");
    const mockNFTs = getMockNFTs();
    return mockNFTs.find(nft => nft.id === id) || null;
  }

  try {
    const response = await fetch(`${ZORA_API_URL}/v1/tokens/${id}`, {
      headers: {
        "Accept": "application/json",
        "X-API-KEY": ZORA_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Zora API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return transformZoraSingleNFT(data);
  } catch (error) {
    console.error(`Error fetching Zora NFT details for ${id}:`, error);
    toast({
      title: "Error",
      description: `Failed to fetch details for NFT ${id}. Using mock data if available.`,
      variant: "destructive",
    });
    const mockNFTs = getMockNFTs();
    return mockNFTs.find(nft => nft.id === id) || null;
  }
};

// Helper function to transform Zora API response to our ZoraNFT type
const transformZoraResponse = (data: any): ZoraNFT[] => {
  // Transform the actual Zora API response to match our ZoraNFT type
  // This will need to be adjusted based on the actual response structure
  try {
    if (!data || !Array.isArray(data.collections)) {
      return getMockNFTs();
    }
    
    return data.collections.map((item: any) => ({
      id: item.collectionAddress || `zora-${Math.random().toString(36).substring(2, 10)}`,
      name: item.name || "Untitled NFT",
      description: item.description || "No description available",
      image: item.image?.url || "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?q=80&w=1932&auto=format&fit=crop",
      collection: {
        id: item.collectionAddress || "unknown",
        name: item.name || "Unknown Collection",
        imageUrl: item.image?.url || "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=1974&auto=format&fit=crop",
      },
      creator: {
        id: item.creator || "unknown",
        name: item.creatorName || "Unknown Creator",
        address: item.creator || "0x0000...0000",
        profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
      },
      tokenId: item.tokenId || "0",
      contract: item.collectionAddress || "0x0000...0000",
      owner: item.owner || "0x0000...0000",
      mintedAt: item.mintedAt || new Date().toISOString(),
      price: {
        amount: item.price?.amount || "0",
        currency: item.price?.currency || "ETH",
      },
      marketStats: {
        floorPrice: item.floorPrice || "0",
        volume24h: item.volume24h || "0",
        volumeTotal: item.volumeTotal || "0",
        marketCap: item.marketCap || "0",
      },
      attributes: item.attributes || [],
      category: item.category || "Art",
    }));
  } catch (error) {
    console.error("Error transforming Zora response:", error);
    return getMockNFTs();
  }
};

// Helper function to transform a single Zora NFT
const transformZoraSingleNFT = (data: any): ZoraNFT => {
  // Transform a single NFT response
  try {
    if (!data || !data.token) {
      return getMockNFTs()[0];
    }
    
    const item = data.token;
    return {
      id: item.tokenId || `zora-${Math.random().toString(36).substring(2, 10)}`,
      name: item.name || "Untitled NFT",
      description: item.description || "No description available",
      image: item.image?.url || "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?q=80&w=1932&auto=format&fit=crop",
      collection: {
        id: item.collectionAddress || "unknown",
        name: item.collectionName || "Unknown Collection",
        imageUrl: item.collectionImage?.url || "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=1974&auto=format&fit=crop",
      },
      creator: {
        id: item.creator || "unknown",
        name: item.creatorName || "Unknown Creator",
        address: item.creator || "0x0000...0000",
        profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
      },
      tokenId: item.tokenId || "0",
      contract: item.collectionAddress || "0x0000...0000",
      owner: item.owner || "0x0000...0000",
      mintedAt: item.mintedAt || new Date().toISOString(),
      price: {
        amount: item.price?.amount || "0",
        currency: item.price?.currency || "ETH",
      },
      marketStats: {
        floorPrice: item.floorPrice || "0",
        volume24h: item.volume24h || "0",
        volumeTotal: item.volumeTotal || "0",
        marketCap: item.marketCap || "0",
      },
      attributes: item.attributes || [],
      category: item.category || "Art",
    };
  } catch (error) {
    console.error("Error transforming single Zora NFT:", error);
    return getMockNFTs()[0];
  }
};

// Helper function to get mock NFTs (used when API is not configured)
const getMockNFTs = (): ZoraNFT[] => {
  return [
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
    // More mock NFTs can be added here
  ];
};
