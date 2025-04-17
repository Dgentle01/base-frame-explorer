// src/services/coinService.ts
import {
    getCoin,
    getCoinsTopGainers,
    getCoinsTopVolume24h,
    getCoinsMostValuable,
    getCoinsNew,
  } from "@zoralabs/coins-sdk";            // SDK methods :contentReference[oaicite:7]{index=7}
  import { base } from "viem/chains";         // Base chain ID (defaults to Base: 8453) :contentReference[oaicite:8]{index=8}
  
  // Fetch detailed info for a single coin by its contract address
  export async function fetchCoinDetails(address: string) {
    const res = await getCoin({ address, chain: base.id });
    return res.data?.zora20Token;           // Zora20Token type with metadata & market data :contentReference[oaicite:9]{index=9}
  }
  
  // Fetch top gainers by market cap change (24 h)
  export async function fetchTopGainers(count = 10, after?: string) {
    const res = await getCoinsTopGainers({ count, after });
    return res.data?.exploreList?.edges?.map(e => e.node);  // Array of coin nodes :contentReference[oaicite:10]{index=10}
  }
  
  // Fetch highest volume coins (24 h)
  export async function fetchTopVolume(count = 10, after?: string) {
    const res = await getCoinsTopVolume24h({ count, after });
    return res.data?.exploreList?.edges?.map(e => e.node);  // Array of coin nodes :contentReference[oaicite:11]{index=11}
  }
  
  // Fetch most valuable coins by market cap
  export async function fetchMostValuable(count = 10, after?: string) {
    const res = await getCoinsMostValuable({ count, after });
    return res.data?.exploreList?.edges?.map(e => e.node);  // Array of coin nodes :contentReference[oaicite:12]{index=12}
  }
  
  // Fetch newly created coins
  export async function fetchNewCoins(count = 10, after?: string) {
    const res = await getCoinsNew({ count, after });
    return res.data?.exploreList?.edges?.map(e => e.node);  // Array of coin nodes :contentReference[oaicite:13]{index=13}
  }
  