
import { createPublicClient, http } from 'viem';
import { mainnet, base } from 'viem/chains';
import { 
  getZoraProtocolAddress, 
  createZoraProtocolActions 
} from '@zoralabs/protocol-sdk';

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

/**
 * Fetch NFT details using Zora Protocol SDK
 * @param contractAddress The NFT contract address
 * @param tokenId The specific token ID
 */
export const fetchZoraNFTDetails = async (contractAddress: string, tokenId: string) => {
  try {
    // Try on Base network first
    try {
      const nftDetails = await baseZoraActions.fetchToken({
        tokenContract: contractAddress,
        tokenId: BigInt(tokenId)
      });

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
  try {
    // Try on Base network first
    try {
      const collectionNFTs = await baseZoraActions.fetchTokensForCollection({
        tokenContract: contractAddress,
        limit: BigInt(limit)
      });

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
    return [];
  }
};
