
// src/components/CoinList.tsx
import React, { useEffect, useState } from "react";
import { fetchTopGainers } from "../services/coinService";

interface CoinNode {
  address: string;
  name: string;
  symbol: string;
  marketCap: string;
  volume24h: string;
  priceChange24h?: string;
  marketCapDelta24h?: string;
}

export function TopGainers() {
  const [coins, setCoins] = useState<CoinNode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchTopGainers(10)
      .then(data => setCoins(data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading top gainers…</div>;

  return (
    <div>
      <h2>Top Gainers (24 h)</h2>
      <ul>
        {coins.map((c, i) => (
          <li key={c.address}>
            {i + 1}. {c.name} ({c.symbol})
            <br />
            24 h Change:{" "}
            {c.priceChange24h 
              ? `${parseFloat(c.priceChange24h).toFixed(2)}%` 
              : c.marketCapDelta24h 
                ? `${parseFloat(c.marketCapDelta24h).toFixed(2)}%`
                : "N/A"}
            <br />
            Market Cap: {c.marketCap}
          </li>
        ))}
      </ul>
    </div>
  );
}
