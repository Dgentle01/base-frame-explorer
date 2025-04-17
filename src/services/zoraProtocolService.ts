
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { 
  getZoraProtocolAddress, 
  createZoraProtocolActions 
} from '@zoralabs/protocol-sdk';

// Create a public client for interacting with Ethereum mainnet
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
});

// Get the Zora Protocol addresses for the current chain
const zoraProtocolAddresses = getZoraProtocolAddress(mainnet.id);

// Create Zora Protocol actions
const zoraProtocolActions = createZoraProtocolActions({
  publicClient,
  zoraProtocolAddresses
});

/**
 * Fetch NFT details using Zora Protocol SDK
 * @param contractAddress The NFT contract address
 * @param tokenId The specific token ID
 */
export const fetchZoraNFTDetails = async (contractAddress: string, tokenId: string) => {
  try {
    const nftDetails = await zoraProtocolActions.fetchToken({
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
    const collectionNFTs = await zoraProtocolActions.fetchTokensForCollection({
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
  } catch (error) {
    console.error('Error listing Zora NFTs:', error);
    return [];
  }
};
