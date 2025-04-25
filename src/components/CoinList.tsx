import React, { useEffect, useState } from "react";
import { fetchTopGainers } from "../services/coinService";
import { Coin } from "@/types/coin";

export function TopGainers() {
  const [coins, setCoins] = useState<Coin[]>([]);
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
              ? `${parseFloat(String(c.priceChange24h)).toFixed(2)}%` 
              : c.marketCapDelta24h 
                ? `${parseFloat(String(c.marketCapDelta24h)).toFixed(2)}%`
                : "N/A"}
            <br />
            Market Cap: {c.marketCap}
          </li>
        ))}
      </ul>
    </div>
  );
}
