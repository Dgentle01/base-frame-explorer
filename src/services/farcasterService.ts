
import { toast } from "@/hooks/use-toast";

// Farcaster API base URL (using Neynar as a provider)
const FARCASTER_API_URL = "https://api.neynar.com/v2";

// API key for Farcaster/Neynar (to be provided by the user)
const FARCASTER_API_KEY = localStorage.getItem("VITE_FARCASTER_API_KEY") || "";

export type FarcasterCast = {
  id: string;
  text: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    profileImage: string;
    followerCount: number;
  };
  timestamp: string;
  likeCount: number;
  recastCount: number;
  replyCount: number;
  threadId?: string;
  parentId?: string;
  embeds?: {
    type: string;
    url?: string;
    nftToken?: {
      id: string;
      name: string;
      image: string;
    };
  }[];
};

// Function to get trending casts from Farcaster
export const getTrendingCasts = async (limit = 10): Promise<FarcasterCast[]> => {
  // Check if API key is available
  if (!FARCASTER_API_KEY) {
    console.warn("Farcaster API key is not configured. Using mock data instead.");
    return getMockCasts();
  }

  try {
    const response = await fetch(`${FARCASTER_API_URL}/feeds/trending?limit=${limit}`, {
      headers: {
        "Accept": "application/json",
        "api_key": FARCASTER_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Farcaster API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return transformFarcasterResponse(data);
  } catch (error) {
    console.error("Error fetching trending casts:", error);
    toast({
      title: "Error",
      description: "Failed to fetch trending casts. Using mock data instead.",
      variant: "destructive",
    });
    return getMockCasts();
  }
};

// Function to get NFT-related casts
export const getNFTCasts = async (nftId: string, limit = 10): Promise<FarcasterCast[]> => {
  // Check if API key is available
  if (!FARCASTER_API_KEY) {
    console.warn("Farcaster API key is not configured. Using mock data instead.");
    return getMockCasts().slice(0, 3);
  }

  try {
    // In a real implementation, we would search for casts mentioning this NFT
    const response = await fetch(`${FARCASTER_API_URL}/feeds/search?q=${encodeURIComponent(nftId)}&limit=${limit}`, {
      headers: {
        "Accept": "application/json",
        "api_key": FARCASTER_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Farcaster API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return transformFarcasterResponse(data);
  } catch (error) {
    console.error(`Error fetching casts for NFT ${nftId}:`, error);
    toast({
      title: "Error",
      description: `Failed to fetch casts related to this NFT. Using mock data instead.`,
      variant: "destructive",
    });
    return getMockCasts().slice(0, 3);
  }
};

// Helper function to transform Farcaster API response to our FarcasterCast type
const transformFarcasterResponse = (data: any): FarcasterCast[] => {
  // Transform the actual Farcaster API response to match our FarcasterCast type
  // This will need to be adjusted based on the actual response structure
  try {
    if (!data || !Array.isArray(data.casts)) {
      return getMockCasts();
    }
    
    return data.casts.map((cast: any) => ({
      id: cast.hash || `fc-${Math.random().toString(36).substring(2, 10)}`,
      text: cast.text || "No text available",
      author: {
        id: cast.author.fid || "unknown",
        username: cast.author.username || "unknown",
        displayName: cast.author.display_name || "Unknown User",
        profileImage: cast.author.pfp_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
        followerCount: cast.author.follower_count || 0
      },
      timestamp: cast.timestamp || new Date().toISOString(),
      likeCount: cast.reactions?.likes || 0,
      recastCount: cast.reactions?.recasts || 0,
      replyCount: cast.replies?.count || 0,
      threadId: cast.thread_hash || undefined,
      parentId: cast.parent_hash || undefined,
      embeds: cast.embeds ? cast.embeds.map((embed: any) => ({
        type: embed.type || "link",
        url: embed.url || undefined,
        nftToken: embed.nft ? {
          id: embed.nft.id || "unknown",
          name: embed.nft.name || "Unknown NFT",
          image: embed.nft.image || "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?q=80&w=1932&auto=format&fit=crop"
        } : undefined
      })) : []
    }));
  } catch (error) {
    console.error("Error transforming Farcaster response:", error);
    return getMockCasts();
  }
};

// Helper function to get mock casts (used when API is not configured)
const getMockCasts = (): FarcasterCast[] => {
  return [
    {
      id: 'fc-1',
      text: 'Just minted a new Cosmic Voyager NFT! The artwork is out of this world 🚀 #NFT #Zora #CosmicVoyagers',
      author: {
        id: 'user1',
        username: 'cosmic_collector',
        displayName: 'Cosmic Collector',
        profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop',
        followerCount: 1245
      },
      timestamp: '2023-12-15T14:30:00Z',
      likeCount: 42,
      recastCount: 7,
      replyCount: 3,
      embeds: [
        {
          type: 'nft',
          nftToken: {
            id: '1',
            name: 'Cosmic Voyager #42',
            image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?q=80&w=1932&auto=format&fit=crop'
          }
        }
      ]
    },
    {
      id: 'fc-2',
      text: 'The floor price for Base Champions is skyrocketing! Glad I got in early 📈 #NFT #BaseChampions',
      author: {
        id: 'user2',
        username: 'nft_prophet',
        displayName: 'NFT Prophet',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
        followerCount: 3782
      },
      timestamp: '2023-12-14T09:45:00Z',
      likeCount: 85,
      recastCount: 23,
      replyCount: 7
    },
    {
      id: 'fc-3',
      text: 'Digital Symphony collection dropping tomorrow! Who's joining the whitelist? 🎵 #DigitalSymphony #NFTDrops',
      author: {
        id: 'user3',
        username: 'harmonichq',
        displayName: 'Harmonic HQ',
        profileImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1780&auto=format&fit=crop',
        followerCount: 5621
      },
      timestamp: '2023-12-13T18:20:00Z',
      likeCount: 121,
      recastCount: 45,
      replyCount: 28,
      embeds: [
        {
          type: 'nft',
          nftToken: {
            id: '2',
            name: 'Digital Symphony #7',
            image: 'https://images.unsplash.com/photo-1558865869-c93f6f8482af?q=80&w=2081&auto=format&fit=crop'
          }
        }
      ]
    },
    {
      id: 'fc-4',
      text: 'Hot take: Zora is the best NFT marketplace for emerging artists. Discuss. 👇 #NFTMarketplace #Zora',
      author: {
        id: 'user4',
        username: 'art_curator',
        displayName: 'NFT Curator',
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop',
        followerCount: 2890
      },
      timestamp: '2023-12-12T11:15:00Z',
      likeCount: 67,
      recastCount: 12,
      replyCount: 31
    },
    {
      id: 'fc-5',
      text: 'Ethereal Landscapes is my favorite collection this month. The visuals are absolutely stunning! #NFTArt #EtherealLandscapes',
      author: {
        id: 'user5',
        username: 'nft_enthusiast',
        displayName: 'NFT Enthusiast',
        profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop',
        followerCount: 1567
      },
      timestamp: '2023-12-11T16:40:00Z',
      likeCount: 52,
      recastCount: 8,
      replyCount: 4,
      embeds: [
        {
          type: 'nft',
          nftToken: {
            id: '6',
            name: 'Ethereal Landscapes #56',
            image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1974&auto=format&fit=crop'
          }
        }
      ]
    }
  ];
};
