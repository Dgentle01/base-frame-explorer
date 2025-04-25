import {
  getCoinsTopGainers,
  getCoinsTopVolume24h,
  getCoinsMostValuable,
  getCoinsNew,
  createCoin,
  tradeCoin,
  simulateBuy,
  type CreateCoinArgs,
  type TradeParams,
  setApiKey,
  getCoin,
  getCoinsLastTraded,
  updateCoinURI,
  updatePayoutRecipient,
} from "@zoralabs/coins-sdk";
import {
  createPublicClient,
  createWalletClient,
  http,
  type Hex,
  type Address,
  parseEther,
} from "viem";
import { base } from "viem/chains";
import { toast } from "@/hooks/use-toast";

// Optional API key setup (best practice for production apps)
// setApiKey("your-api-key-here");

// 1) Initialize a public client to read on‑chain data
export const publicClient = createPublicClient({
  chain: base,
  transport: http("https://rpc.base.org"),
});

// 2) Initialize a wallet client for signing transactions
export function getWalletClient(account: Hex) {
  return createWalletClient({
    account,
    chain: base,
    transport: http("https://rpc.base.org"),
  });
}

// Helper function to normalize price change data
const normalizeCoinData = (coin: any) => {
  if (!coin) return null;
  
  return {
    ...coin,
    priceChange24h: coin.priceChange24h || coin.marketCapDelta24h || "0.00",
    imageUrl: coin.image || coin.metadata?.image || null
  };
};

// --- EXPLORE QUERIES ---
// Fetch top gainers by market cap change (24 h)
export async function fetchTopGainers(count = 10, after?: string) {
  try {
    const res = await getCoinsTopGainers({ count, after });
    const coins = res.data?.exploreList?.edges.map((e) => e.node) ?? [];
    
    // Normalize each coin to have consistent fields
    return coins.map(coin => normalizeCoinData(coin));
  } catch (error) {
    console.error("Error fetching top gainers:", error);
    toast({
      title: "Error fetching top gainers",
      description: "Could not load top gaining coins. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
}

// Fetch highest volume coins (24 h)
export async function fetchTopVolume(count = 10, after?: string) {
  try {
    const res = await getCoinsTopVolume24h({ count, after });
    const coins = res.data?.exploreList?.edges.map((e) => e.node) ?? [];
    return coins.map(coin => normalizeCoinData(coin));
  } catch (error) {
    console.error("Error fetching top volume:", error);
    toast({
      title: "Error fetching high volume coins",
      description: "Could not load top volume coins. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
}

// Fetch most valuable coins by market cap
export async function fetchMostValuable(count = 10, after?: string) {
  try {
    const res = await getCoinsMostValuable({ count, after });
    const coins = res.data?.exploreList?.edges.map((e) => e.node) ?? [];
    return coins.map(coin => normalizeCoinData(coin));
  } catch (error) {
    console.error("Error fetching most valuable coins:", error);
    toast({
      title: "Error fetching valuable coins",
      description: "Could not load most valuable coins. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
}

// Fetch newly created coins
export async function fetchNewCoins(count = 10, after?: string) {
  try {
    const res = await getCoinsNew({ count, after });
    const coins = res.data?.exploreList?.edges.map((e) => e.node) ?? [];
    return coins.map(coin => normalizeCoinData(coin));
  } catch (error) {
    console.error("Error fetching new coins:", error);
    toast({
      title: "Error fetching new coins",
      description: "Could not load newly created coins. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
}

// Fetch recently traded coins
export async function fetchRecentlyTraded(count = 10, after?: string) {
  try {
    const res = await getCoinsLastTraded({ count, after });
    const coins = res.data?.exploreList?.edges.map((e) => e.node) ?? [];
    return coins.map(coin => normalizeCoinData(coin));
  } catch (error) {
    console.error("Error fetching recently traded coins:", error);
    toast({
      title: "Error fetching recently traded coins",
      description: "Could not load recently traded coins. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
}

// Fetch details for a specific coin
export async function fetchCoinDetails(address: string) {
  try {
    const res = await getCoin({ address });
    
    // Normalize the coin data if it exists
    if (res.data?.zora20Token) {
      return normalizeCoinData(res.data.zora20Token);
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching coin details:", error);
    toast({
      title: "Error fetching coin details",
      description: "Could not load details for this coin. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
}

// Fetch top losers by market cap change (24h)
export async function fetchTopLosers(count = 10, after?: string) {
  try {
    const res = await getCoinsTopGainers({ count: count * 2, after }); // Fetch more to filter losers
    const coins = res.data?.exploreList?.edges.map((e) => e.node) ?? [];
    
    // Filter and sort to get coins with negative price change
    const losers = coins
      .filter(coin => {
        const change = parseFloat(coin.priceChange24h || coin.marketCapDelta24h || "0");
        return change < 0;
      })
      .sort((a, b) => {
        const changeA = parseFloat(a.priceChange24h || a.marketCapDelta24h || "0");
        const changeB = parseFloat(b.priceChange24h || b.marketCapDelta24h || "0");
        return changeA - changeB;
      })
      .slice(0, count);

    return losers.map(coin => normalizeCoinData(coin));
  } catch (error) {
    console.error("Error fetching top losers:", error);
    toast({
      title: "Error fetching top losers",
      description: "Could not load top losing coins. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
}

// --- CREATE COIN CALL ---
// Deploy a new ERC‑20 media coin on Zora (Base)
export async function deployCoin(
  args: CreateCoinArgs,
  account: Hex
): Promise<{ hash: string; address: string }> {
  try {
    const walletClient = getWalletClient(account);
    // createCoin handles both deployment & optional initial purchase
    const result = await createCoin(args, walletClient, publicClient);
    return {
      hash: result.hash,
      address: result.address,
    };
  } catch (error) {
    console.error("Error deploying coin:", error);
    toast({
      title: "Error creating coin",
      description: "Could not create your coin. Please check your wallet and try again.",
      variant: "destructive",
    });
    throw error;
  }
}

// --- UPDATE COIN FUNCTIONS ---
// Update coin metadata URI
export async function updateCoinMetadata(
  coinAddress: Address,
  newURI: string,
  account: Hex
): Promise<{ hash: string }> {
  try {
    const walletClient = getWalletClient(account);
    
    const result = await updateCoinURI({
      coin: coinAddress,
      newURI: newURI
    }, walletClient, publicClient);
    
    return {
      hash: result.hash,
    };
  } catch (error) {
    console.error("Error updating coin metadata:", error);
    toast({
      title: "Error updating coin metadata",
      description: "Failed to update the coin's metadata URI.",
      variant: "destructive",
    });
    throw error;
  }
}

// Update coin payout recipient
export async function updateCoinPayoutRecipient(
  coinAddress: Address,
  newPayoutRecipient: Address,
  account: Hex
): Promise<{ hash: string }> {
  try {
    const walletClient = getWalletClient(account);
    
    const result = await updatePayoutRecipient({
      coin: coinAddress,
      newPayoutRecipient: newPayoutRecipient
    }, walletClient, publicClient);
    
    return {
      hash: result.hash,
    };
  } catch (error) {
    console.error("Error updating payout recipient:", error);
    toast({
      title: "Error updating payout recipient",
      description: "Failed to update the coin's payout recipient.",
      variant: "destructive",
    });
    throw error;
  }
}

// --- TRADE COINS ---
// Buy a coin with ETH
export async function buyCoin(
  coinAddress: Address,
  amountETH: string,
  account: Hex,
  minAmountOut: bigint = 0n,
  referrer?: Address
): Promise<{ hash: string }> {
  try {
    const walletClient = getWalletClient(account);
    
    const buyParams: TradeParams = {
      direction: "buy",
      target: coinAddress,
      args: {
        recipient: account as Address,
        orderSize: parseEther(amountETH),
        minAmountOut: minAmountOut,
        tradeReferrer: referrer,
      }
    };
    
    const result = await tradeCoin(buyParams, walletClient, publicClient);
    return {
      hash: result.hash,
    };
  } catch (error) {
    console.error("Error buying coin:", error);
    toast({
      title: "Error buying coin",
      description: "Could not complete your purchase. Please check your wallet and try again.",
      variant: "destructive",
    });
    throw error;
  }
}

// Sell a coin for ETH
export async function sellCoin(
  coinAddress: Address,
  tokenAmount: string,
  account: Hex,
  minAmountOut: bigint = 0n,
  referrer?: Address
): Promise<{ hash: string }> {
  try {
    const walletClient = getWalletClient(account);
    
    const sellParams: TradeParams = {
      direction: "sell",
      target: coinAddress,
      args: {
        recipient: account as Address,
        orderSize: parseEther(tokenAmount), // This assumes 18 decimals for token
        minAmountOut: minAmountOut,
        tradeReferrer: referrer,
      }
    };
    
    const result = await tradeCoin(sellParams, walletClient, publicClient);
    return {
      hash: result.hash,
    };
  } catch (error) {
    console.error("Error selling coin:", error);
    toast({
      title: "Error selling coin",
      description: "Could not complete your sale. Please check your wallet and try again.",
      variant: "destructive",
    });
    throw error;
  }
}

// Simulate buy to check expected output
export async function simulateCoinBuy(
  coinAddress: Address,
  amountETH: string
) {
  try {
    const simulation = await simulateBuy({
      target: coinAddress,
      requestedOrderSize: parseEther(amountETH),
      publicClient,
    });
    
    return {
      orderSize: simulation.orderSize,
      amountOut: simulation.amountOut,
    };
  } catch (error) {
    console.error("Error simulating buy:", error);
    throw error;
  }
}

// Custom implementation of simulateSell since it's not exported from the SDK
export async function simulateCoinSell(
  coinAddress: Address,
  tokenAmount: string
) {
  try {
    // Since simulateSell isn't available from the SDK, we'll make a simplified version
    // This is just a placeholder that returns a mock value
    console.warn("Using placeholder simulateCoinSell function - real simulation not available");
    
    // Simplified calculation for demo purposes
    const mockAmountOut = parseEther(tokenAmount) / 10n; // Simplified calculation
    
    return {
      amountOut: mockAmountOut,
    };
  } catch (error) {
    console.error("Error simulating sell:", error);
    throw error;
  }
}
