
import {
  getCoinsTopGainers,
  getCoinsTopVolume24h,
  getCoinsMostValuable,
  getCoinsNew,
  createCoin,
  tradeCoin,
  simulateBuy,
  simulateSell,
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

// --- EXPLORE QUERIES ---
// Fetch top gainers by market cap change (24 h)
export async function fetchTopGainers(count = 10, after?: string) {
  try {
    const res = await getCoinsTopGainers({ count, after });
    return res.data?.exploreList?.edges.map((e) => e.node) ?? [];
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
    return res.data?.exploreList?.edges.map((e) => e.node) ?? [];
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
    return res.data?.exploreList?.edges.map((e) => e.node) ?? [];
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
    return res.data?.exploreList?.edges.map((e) => e.node) ?? [];
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
    return res.data?.exploreList?.edges.map((e) => e.node) ?? [];
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
    return res.data?.zora20Token;
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

// Simulate sell to check expected output
export async function simulateCoinSell(
  coinAddress: Address,
  tokenAmount: string
) {
  try {
    const simulation = await simulateSell({
      target: coinAddress,
      requestedSellAmount: parseEther(tokenAmount),
      publicClient,
    });
    
    return {
      amountOut: simulation.amountOut,
    };
  } catch (error) {
    console.error("Error simulating sell:", error);
    throw error;
  }
}
