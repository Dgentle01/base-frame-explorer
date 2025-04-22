
import React, { useEffect, useState } from "react";
import { fetchCoinDetails } from "../services/coinService";

interface CoinDetailsProps { 
  address: string;
}

export function CoinDetails({ address }: CoinDetailsProps) {
  const [coin, setCoin] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCoinDetails() {
      try {
        setLoading(true);
        const coinData = await fetchCoinDetails(address);
        setCoin(coinData);
        setError(null);
      } catch (err) {
        console.error("Error loading coin details:", err);
        setError("Failed to load coin details");
      } finally {
        setLoading(false);
      }
    }

    loadCoinDetails();
  }, [address]);

  if (loading) return <div>Loading details…</div>;
  if (error) return <div>Error: {error}</div>;
  if (!coin) return <div>No coin data found</div>;

  // Format price change for display
  const priceChange = coin.priceChange24h ? 
    `${parseFloat(coin.priceChange24h).toFixed(2)}%` : 
    (coin.marketCapDelta24h ? 
      `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%` : 
      "N/A");

  return (
    <div>
      <h2>{coin.name} ({coin.symbol})</h2>
      <p>{coin.description || "No description available"}</p>
      <ul>
        <li>Total Supply: {coin.totalSupply || "Unknown"}</li>
        <li>Market Cap: {coin.marketCap || "Unknown"}</li>
        <li>24h Volume: {coin.volume24h || "Unknown"}</li>
        <li>24h Price Change: {priceChange}</li>
        <li>Created At: {coin.createdAt ? new Date(coin.createdAt).toLocaleString() : "Unknown"}</li>
      </ul>
    </div>
  );
}
