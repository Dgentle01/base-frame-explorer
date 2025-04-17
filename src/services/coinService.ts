// src/services/coinService.ts

import {
    getCoinsTopGainers,
    getCoinsTopVolume24h,
    getCoinsMostValuable,
    getCoinsNew,
    createCoin,
    type CreateCoinArgs,
  } from "@zoralabs/coins-sdk";                            // Zora Coins SDK functions :contentReference[oaicite:3]{index=3}
  import {
    createPublicClient,
    createWalletClient,
    http,
    type Hex,
  } from "viem";                                            // viem clients & types :contentReference[oaicite:4]{index=4}
  import { base } from "viem/chains";                        // Base network config (Chain ID 8453) :contentReference[oaicite:5]{index=5}
  
  // 1) Initialize a public client to read on‑chain data
  export const publicClient = createPublicClient({
    chain: base,
    transport: http("https://rpc.base.org"),               // Replace with your Base RPC if needed
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
  // Fetch top gainers by market cap change (24 h)
  export async function fetchTopGainers(count = 10, after?: string) {
    const res = await getCoinsTopGainers({ count, after });
    return res.data?.exploreList?.edges.map((e) => e.node) ?? [];
  }
  
  // Fetch highest volume coins (24 h)
  export async function fetchTopVolume(count = 10, after?: string) {
    const res = await getCoinsTopVolume24h({ count, after });
    return res.data?.exploreList?.edges.map((e) => e.node) ?? [];
  }
  
  // Fetch most valuable coins by market cap
  export async function fetchMostValuable(count = 10, after?: string) {
    const res = await getCoinsMostValuable({ count, after });
    return res.data?.exploreList?.edges.map((e) => e.node) ?? [];
  }
  
  // Fetch newly created coins
  export async function fetchNewCoins(count = 10, after?: string) {
    const res = await getCoinsNew({ count, after });
    return res.data?.exploreList?.edges.map((e) => e.node) ?? [];
  }
  
  // --- CREATE COIN CALL ---
  // Deploy a new ERC‑20 media coin on Zora (Base)
  export async function deployCoin(
    args: CreateCoinArgs,
    account: Hex
  ): Promise<{ hash: string; address: string }> {
    const walletClient = getWalletClient(account);
    // createCoin handles both deployment & optional initial purchase
    const result = await createCoin(args, walletClient, publicClient);
    return {
      hash: result.hash,
      address: result.address,
    };
  }
  