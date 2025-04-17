
import { createPublicClient, http } from 'viem';
import { mainnet, base } from 'viem/chains';
import { 
  getZoraProtocolAddress, 
  createZoraProtocolActions,
  createCreatorClient,
  createCollectorClient
} from '@zoralabs/protocol-sdk';
import { toast } from "@/hooks/use-toast";

// Create a public client for interacting with Base and Ethereum networks
const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http()
});

const baseClient = createPublicClient({
  chain: base,
  transport: http()
});

// Get the Zora Protocol addresses for both chains
const mainnetZoraAddresses = getZoraProtocolAddress(mainnet.id);
const baseZoraAddresses = getZoraProtocolAddress(base.id);

// Create Zora Protocol actions for both networks
const mainnetZoraActions = createZoraProtocolActions({
  publicClient: mainnetClient,
  zoraProtocolAddresses: mainnetZoraAddresses
});

const baseZoraActions = createZoraProtocolActions({
  publicClient: baseClient,
  zoraProtocolAddresses: baseZoraAddresses
});

// Create Zora Creator client for Base network
const baseCreatorClient = createCreatorClient({
  chainId: base.id,
  publicClient: baseClient
});

// Create Zora Creator client for Mainnet
const mainnetCreatorClient = createCreatorClient({
  chainId: mainnet.id,
  publicClient: mainnetClient
});

// Create Zora Collector client for Base network
const baseCollectorClient = createCollectorClient({
  chainId: base.id,
  publicClient: baseClient
});

// Create Zora Collector client for Mainnet
const mainnetCollectorClient = createCollectorClient({
  chainId: mainnet.id,
  publicClient: mainnetClient
});

// Example collections that work with the Protocol SDK
export const ZORA_EXAMPLE_COLLECTIONS = {
  base: [
    {
      address: '0x010be6857f8af26b8646cd04cef29d63b8b979ee', // Remilia Corporation
      name: 'Remilia Corporation'
    },
    {
      address: '0x999e88075692bCeE3dBC07e7E64cD32f39A1D3ab', // Base Dawgz
      name: 'Base Dawgz'
    }
  ],
  mainnet: [
    {
      address: '0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61', // ZORA: Crypto Punks
      name: 'ZORA: Crypto Punks'
    }
  ]
};

/**
 * Fetch NFT details using Zora Protocol SDK
 * @param contractAddress The NFT contract address
 * @param tokenId The specific token ID
 */
export const fetchZoraNFTDetails = async (contractAddress: string, tokenId: string) => {
  console.log(`Fetching NFT details for ${contractAddress}-${tokenId} using Protocol SDK`);
  
  try {
    // Try on Base network first
    try {
      console.log("Attempting to fetch from Base network...");
      const nftDetails = await baseZoraActions.fetchToken({
        tokenContract: contractAddress,
        tokenId: BigInt(tokenId)
      });

      console.log("Successfully fetched from Base network:", nftDetails);
      return {
        id: `${contractAddress}-${tokenId}`,
        name: nftDetails.name || 'Unnamed NFT',
        description: nftDetails.description || 'No description available',
        image: nftDetails.imageURI || '',
        creator: {
          id: nftDetails.creator || 'unknown',
          name: 'Unknown Creator', // SDK might not provide creator name directly
          address: nftDetails.creator || '0x0',
          profileImageUrl: '' // Zora SDK doesn't provide profile image
        },
        contract: contractAddress,
        tokenId: tokenId,
        mintedAt: new Date(Number(nftDetails.mintedTimestamp) * 1000).toISOString(),
        // Additional fields can be added based on Zora Protocol SDK response
      };
    } catch (baseError) {
      console.log("Not found on Base, trying Ethereum mainnet...", baseError);
      
      // If not found on Base, try Ethereum mainnet
      const nftDetails = await mainnetZoraActions.fetchToken({
        tokenContract: contractAddress,
        tokenId: BigInt(tokenId)
      });

      console.log("Successfully fetched from Ethereum mainnet:", nftDetails);
      return {
        id: `${contractAddress}-${tokenId}`,
        name: nftDetails.name || 'Unnamed NFT',
        description: nftDetails.description || 'No description available',
        image: nftDetails.imageURI || '',
        creator: {
          id: nftDetails.creator || 'unknown',
          name: 'Unknown Creator', // SDK might not provide creator name directly
          address: nftDetails.creator || '0x0',
          profileImageUrl: '' // Zora SDK doesn't provide profile image
        },
        contract: contractAddress,
        tokenId: tokenId,
        mintedAt: new Date(Number(nftDetails.mintedTimestamp) * 1000).toISOString(),
        // Additional fields can be added based on Zora Protocol SDK response
      };
    }
  } catch (error) {
    console.error('Error fetching Zora NFT details:', error);
    return null;
  }
};

/**
 * List NFTs from a specific collection using Zora Protocol SDK
 * @param contractAddress The NFT collection contract address
 * @param limit Number of NFTs to fetch
 */
export const listZoraNFTs = async (contractAddress: string, limit = 10) => {
  console.log(`Listing NFTs for collection ${contractAddress} using Protocol SDK, limit: ${limit}`);
  
  try {
    // Try on Base network first
    try {
      console.log("Attempting to list from Base network...");
      const collectionNFTs = await baseZoraActions.fetchTokensForCollection({
        tokenContract: contractAddress,
        limit: BigInt(limit)
      });

      console.log(`Successfully listed ${collectionNFTs.length} NFTs from Base network`);
      return collectionNFTs.map(token => ({
        id: `${contractAddress}-${token.tokenId}`,
        name: token.name || 'Unnamed NFT',
        image: token.imageURI || '',
        tokenId: token.tokenId.toString(),
        // Add more details as needed
      }));
    } catch (baseError) {
      console.log("Collection not found on Base, trying Ethereum mainnet...", baseError);
      
      // If not found on Base, try Ethereum mainnet
      const collectionNFTs = await mainnetZoraActions.fetchTokensForCollection({
        tokenContract: contractAddress,
        limit: BigInt(limit)
      });

      console.log(`Successfully listed ${collectionNFTs.length} NFTs from Ethereum mainnet`);
      return collectionNFTs.map(token => ({
        id: `${contractAddress}-${token.tokenId}`,
        name: token.name || 'Unnamed NFT',
        image: token.imageURI || '',
        tokenId: token.tokenId.toString(),
        // Add more details as needed
      }));
    }
  } catch (error) {
    console.error('Error listing Zora NFTs:', error);
    toast({
      title: "Error fetching NFTs",
      description: "Could not fetch NFTs from Zora Protocol. Check console for details.",
      variant: "destructive"
    });
    return [];
  }
};

/**
 * Get secondary market information for an NFT
 * @param contractAddress The NFT contract address
 * @param tokenId The specific token ID
 */
export const getSecondaryInfo = async (contractAddress: string, tokenId: string) => {
  console.log(`Getting secondary info for ${contractAddress}-${tokenId}`);

  try {
    // Try on Base network first
    try {
      const secondaryInfo = await baseCollectorClient.getSecondaryInfo({
        tokenContract: contractAddress,
        tokenId: BigInt(tokenId)
      });
      console.log("Secondary info from Base:", secondaryInfo);
      return secondaryInfo;
    } catch (baseError) {
      console.log("Secondary info not found on Base, trying Ethereum mainnet...", baseError);
      
      // If not found on Base, try Ethereum mainnet
      const secondaryInfo = await mainnetCollectorClient.getSecondaryInfo({
        tokenContract: contractAddress,
        tokenId: BigInt(tokenId)
      });
      console.log("Secondary info from Ethereum mainnet:", secondaryInfo);
      return secondaryInfo;
    }
  } catch (error) {
    console.error('Error getting secondary market info:', error);
    return null;
  }
};

/**
 * Get minting costs for an NFT
 * @param contractAddress The NFT contract address 
 */
export const getMintCosts = async (contractAddress: string) => {
  console.log(`Getting mint costs for collection ${contractAddress}`);

  try {
    // Try on Base network first
    try {
      const mintCosts = await baseCollectorClient.getMintCosts({
        tokenContract: contractAddress
      });
      console.log("Mint costs from Base:", mintCosts);
      return mintCosts;
    } catch (baseError) {
      console.log("Mint costs not found on Base, trying Ethereum mainnet...", baseError);
      
      // If not found on Base, try Ethereum mainnet
      const mintCosts = await mainnetCollectorClient.getMintCosts({
        tokenContract: contractAddress
      });
      console.log("Mint costs from Ethereum mainnet:", mintCosts);
      return mintCosts;
    }
  } catch (error) {
    console.error('Error getting mint costs:', error);
    return null;
  }
};

/**
 * Get a random collection from the example collections
 * @returns A random collection address and name
 */
export const getRandomCollection = () => {
  const allCollections = [...ZORA_EXAMPLE_COLLECTIONS.base, ...ZORA_EXAMPLE_COLLECTIONS.mainnet];
  const randomIndex = Math.floor(Math.random() * allCollections.length);
  return allCollections[randomIndex];
};
