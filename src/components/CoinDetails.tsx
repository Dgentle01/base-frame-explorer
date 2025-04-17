// src/components/CoinDetails.tsx
import React, { useEffect, useState } from "react";
import { fetchCoinDetails } from "../services/coinService";

interface DetailsProps { address: string; }

export function CoinDetails({ address }: DetailsProps) {
  const [coin, setCoin] = useState<any>(null);

  useEffect(() => {
    fetchCoinDetails(address).then(setCoin);
  }, [address]);

  if (!coin) return <div>Loading details…</div>;

  return (
    <div>
      <h2>{coin.name} ({coin.symbol})</h2>
      <p>{coin.description}</p>
      <ul>
        <li>Total Supply: {coin.totalSupply}</li>
        <li>Market Cap: {coin.marketCap}</li>
        <li>24 h Volume: {coin.volume24h}</li>
        <li>Created At: {new Date(coin.createdAt || "").toLocaleString()}</li>
      </ul>
    </div>
  );
}
