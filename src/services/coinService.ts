
// src/services/coinService.ts

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
