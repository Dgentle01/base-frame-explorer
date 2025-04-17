
import { toast } from "@/hooks/use-toast";
import { fetchZoraNFTDetails, listZoraNFTs } from './zoraProtocolService';

// Zora API base URL
const ZORA_API_URL = "https://api.zora.co/graphql";

// API key for Zora (to be provided by the user)
const ZORA_API_KEY = localStorage.getItem("VITE_ZORA_API_KEY") || "";

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

// GraphQL query for fetching trending NFTs
const TRENDING_NFTS_QUERY = `
  query TrendingTokens($limit: Int!) {
    tokens(
      networks: [{network: ETHEREUM, chain: MAINNET}],
      pagination: {limit: $limit},
      sort: {sortKey: MINTED, sortDirection: DESC}
    ) {
      nodes {
        token {
          tokenId
          name
          description
          image {
            url
            mimeType
          }
          mintInfo {
            originatorAddress
            toAddress
            mintContext {
              blockTimestamp
            }
          }
          owner
          tokenContract {
            name
            address
            symbol
            networkInfo {
              network
              chain
            }
          }
          attributes {
            displayType
            traitType
            value
          }
        }
        market {
          floorPrice {
            amount {
              decimal
            }
            currency {
              symbol
            }
          }
          volume {
            amount {
              decimal
            }
          }
        }
      }
    }
  }
`;

// GraphQL query for fetching a specific NFT
const NFT_DETAIL_QUERY = `
  query TokenDetail($address: String!, $tokenId: String!) {
    token(token: {address: $address, tokenId: $tokenId}) {
      token {
        tokenId
        name
        description
        image {
          url
          mimeType
        }
        mintInfo {
          originatorAddress
          toAddress
          mintContext {
            blockTimestamp
          }
        }
        owner
        tokenContract {
          name
          address
          symbol
          description
          networkInfo {
            network
            chain
          }
        }
        attributes {
          displayType
          traitType
          value
        }
      }
      market {
        floorPrice {
          amount {
            decimal
          }
          currency {
            symbol
          }
        }
        volume {
          amount {
            decimal
          }
        }
      }
    }
  }
`;

// Function to get NFTs from Zora
export const getZoraNFTs = async (limit = 10): Promise<ZoraNFT[]> => {
  // Check if API key is available
  if (!ZORA_API_KEY) {
    console.warn("Zora API key is not configured. Using Zora Protocol SDK.");
    
    // Example: Fetch from a known collection on Base network
    const exampleCollectionAddress = '0x010be6857f8af26b8646cd04cef29d63b8b979ee'; // Remilia Corporation
    const nftsFromCollection = await listZoraNFTs(exampleCollectionAddress, limit);
    
    // If no NFTs found, fall back to mock data
    return nftsFromCollection.length > 0 
      ? nftsFromCollection.map(nft => ({
          ...nft,
          description: 'Fetched via Zora Protocol SDK',
          collection: {
            id: exampleCollectionAddress,
            name: 'Base Collection',
            imageUrl: nft.image || '',
          },
          creator: {
            id: 'protocol-sdk',
            name: 'Zora Protocol',
            address: '0x0',
            profileImageUrl: ''
          },
          owner: '0x0',
          price: { amount: '0', currency: 'ETH' },
          marketStats: {
            floorPrice: '0',
            volume24h: '0',
            volumeTotal: '0',
            marketCap: '0'
          },
          category: 'Art',
          attributes: []
        }))
      : getMockNFTs();
  }

  try {
    const response = await fetch(ZORA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': ZORA_API_KEY
      },
      body: JSON.stringify({
        query: TRENDING_NFTS_QUERY,
        variables: { limit }
      })
    });

    if (!response.ok) {
      throw new Error(`Zora API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return transformZoraGraphQLResponse(data);
  } catch (error) {
    console.error("Error fetching Zora NFTs:", error);
    toast({
      title: "Error",
      description: "Failed to fetch Zora NFTs. Using fallback data instead.",
      variant: "destructive",
    });
    
    // Try with SDK as fallback
    const exampleCollectionAddress = '0x010be6857f8af26b8646cd04cef29d63b8b979ee';
    const nftsFromSdk = await listZoraNFTs(exampleCollectionAddress, limit);
    
    return nftsFromSdk.length > 0 
      ? nftsFromSdk.map(nft => ({
          ...nft,
          description: 'Fetched via Zora Protocol SDK (fallback)',
          collection: {
            id: exampleCollectionAddress,
            name: 'Base Collection',
            imageUrl: nft.image || '',
          },
          creator: {
            id: 'protocol-sdk',
            name: 'Zora Protocol',
            address: '0x0',
            profileImageUrl: ''
          },
          owner: '0x0',
          price: { amount: '0', currency: 'ETH' },
          marketStats: {
            floorPrice: '0',
            volume24h: '0',
            volumeTotal: '0',
            marketCap: '0'
          },
          category: 'Art',
          attributes: []
        }))
      : getMockNFTs();
  }
};

// Function to get NFT details from Zora
export const getZoraNFTDetails = async (id: string): Promise<ZoraNFT | null> => {
  // Parse the ID to get contract address and token ID
  const [contractAddress, tokenId] = id.split('-');
  
  if (!contractAddress || !tokenId) {
    toast({
      title: "Invalid NFT ID",
      description: "The provided NFT ID is not in the correct format.",
      variant: "destructive"
    });
    return null;
  }

  // Check if API key is available
  if (!ZORA_API_KEY) {
    console.warn("Zora API key is not configured. Using Zora Protocol SDK.");
    const nftDetails = await fetchZoraNFTDetails(contractAddress, tokenId);
    
    return nftDetails ? {
      ...nftDetails,
      owner: '0x0', // Add missing fields from the protocol SDK
      collection: {
        id: contractAddress,
        name: 'Base Collection',
        imageUrl: nftDetails.image || '',
      },
      price: { amount: '0', currency: 'ETH' },
      marketStats: {
        floorPrice: '0',
        volume24h: '0',
        volumeTotal: '0',
        marketCap: '0'
      },
      category: 'Art',
      attributes: []
    } : null;
  }

  try {
    const response = await fetch(ZORA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': ZORA_API_KEY
      },
      body: JSON.stringify({
        query: NFT_DETAIL_QUERY,
        variables: { 
          address: contractAddress,
          tokenId: tokenId
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Zora API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return transformZoraGraphQLSingleNFT(data, id);
  } catch (error) {
    console.error(`Error fetching Zora NFT details for ${id}:`, error);
    toast({
      title: "Error",
      description: `Failed to fetch details for NFT ${id}. Using fallback method.`,
      variant: "destructive",
    });
    
    // Try with SDK as fallback
    const nftDetails = await fetchZoraNFTDetails(contractAddress, tokenId);
    
    if (nftDetails) {
      return {
        ...nftDetails,
        owner: '0x0',
        collection: {
          id: contractAddress,
          name: 'Base Collection',
          imageUrl: nftDetails.image || '',
        },
        price: { amount: '0', currency: 'ETH' },
        marketStats: {
          floorPrice: '0',
          volume24h: '0',
          volumeTotal: '0',
          marketCap: '0'
        },
        category: 'Art',
        attributes: []
      };
    }
    
    const mockNFTs = getMockNFTs();
    return mockNFTs.find(nft => nft.id === id) || null;
  }
};

// Helper function to transform Zora GraphQL response to our ZoraNFT type
const transformZoraGraphQLResponse = (data: any): ZoraNFT[] => {
  if (!data?.data?.tokens?.nodes || !Array.isArray(data.data.tokens.nodes)) {
    console.error("Invalid Zora API response format:", data);
    return getMockNFTs();
  }
  
  return data.data.tokens.nodes.map((node: any) => {
    const token = node.token;
    const market = node.market;
    
    if (!token) return getMockNFTs()[0];
    
    const mintTimestamp = token.mintInfo?.mintContext?.blockTimestamp 
      ? new Date(token.mintInfo.mintContext.blockTimestamp * 1000).toISOString()
      : new Date().toISOString();
    
    return {
      id: `${token.tokenContract.address}-${token.tokenId}`,
      name: token.name || "Untitled NFT",
      description: token.description || "No description available",
      image: token.image?.url || "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?q=80&w=1932&auto=format&fit=crop",
      collection: {
        id: token.tokenContract.address || "unknown",
        name: token.tokenContract.name || "Unknown Collection",
        imageUrl: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=1974&auto=format&fit=crop",
      },
      creator: {
        id: token.mintInfo?.originatorAddress || "unknown",
        name: "Unknown Creator", // GraphQL might not provide creator name directly
        address: token.mintInfo?.originatorAddress || "0x0000...0000",
        profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
      },
      tokenId: token.tokenId || "0",
      contract: token.tokenContract.address || "0x0000...0000",
      owner: token.owner || "0x0000...0000",
      mintedAt: mintTimestamp,
      price: {
        amount: market?.floorPrice?.amount?.decimal?.toString() || "0",
        currency: market?.floorPrice?.currency?.symbol || "ETH",
      },
      marketStats: {
        floorPrice: market?.floorPrice?.amount?.decimal?.toString() || "0",
        volume24h: "0", // Not directly provided in this query
        volumeTotal: market?.volume?.amount?.decimal?.toString() || "0",
        marketCap: "0", // Not directly provided in this query
      },
      attributes: token.attributes?.map((attr: any) => ({
        trait_type: attr.traitType || "",
        value: attr.value || "",
      })) || [],
      category: getCategoryFromAttributes(token.attributes) || "Art",
    };
  });
};

// Helper function to transform a single Zora NFT from GraphQL
const transformZoraGraphQLSingleNFT = (data: any, id: string): ZoraNFT => {
  if (!data?.data?.token?.token) {
    console.error("Invalid Zora API response format for single NFT:", data);
    return getMockNFTs()[0];
  }
  
  const token = data.data.token.token;
  const market = data.data.token.market;
  
  const mintTimestamp = token.mintInfo?.mintContext?.blockTimestamp 
    ? new Date(token.mintInfo.mintContext.blockTimestamp * 1000).toISOString()
    : new Date().toISOString();
  
  return {
    id: id,
    name: token.name || "Untitled NFT",
    description: token.description || "No description available",
    image: token.image?.url || "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?q=80&w=1932&auto=format&fit=crop",
    collection: {
      id: token.tokenContract.address || "unknown",
      name: token.tokenContract.name || "Unknown Collection",
      imageUrl: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=1974&auto=format&fit=crop",
    },
    creator: {
      id: token.mintInfo?.originatorAddress || "unknown",
      name: "Unknown Creator", // GraphQL might not provide creator name directly
      address: token.mintInfo?.originatorAddress || "0x0000...0000",
      profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
    },
    tokenId: token.tokenId || "0",
    contract: token.tokenContract.address || "0x0000...0000",
    owner: token.owner || "0x0000...0000",
    mintedAt: mintTimestamp,
    price: {
      amount: market?.floorPrice?.amount?.decimal?.toString() || "0",
      currency: market?.floorPrice?.currency?.symbol || "ETH",
    },
    marketStats: {
      floorPrice: market?.floorPrice?.amount?.decimal?.toString() || "0",
      volume24h: "0", // Not directly provided in this query
      volumeTotal: market?.volume?.amount?.decimal?.toString() || "0",
      marketCap: "0", // Not directly provided in this query
    },
    attributes: token.attributes?.map((attr: any) => ({
      trait_type: attr.traitType || "",
      value: attr.value || "",
    })) || [],
    category: getCategoryFromAttributes(token.attributes) || "Art",
  };
};

// Helper function to determine NFT category from attributes
const getCategoryFromAttributes = (attributes: any[] = []): string => {
  if (!attributes || !Array.isArray(attributes)) return "Art";
  
  const categoryAttribute = attributes.find(attr => 
    attr.traitType?.toLowerCase() === "category" || 
    attr.traitType?.toLowerCase() === "type"
  );
  
  if (categoryAttribute?.value) {
    const value = categoryAttribute.value.toLowerCase();
    if (value.includes("music")) return "Music";
    if (value.includes("photo")) return "Photography";
    if (value.includes("collect")) return "Collectible";
  }
  
  return "Art";
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
