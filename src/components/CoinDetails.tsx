
import React, { useEffect, useState } from "react";
import { fetchCoinDetails } from "../services/coinService";
import { Coin } from "@/types/coin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CoinDetailsProps { 
  address: string;
}

export function CoinDetails({ address }: CoinDetailsProps) {
  const [coin, setCoin] = useState<Coin | null>(null);
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!coin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No coin data found</p>
        </CardContent>
      </Card>
    );
  }

  // Format price change for display
  const priceChange = coin.priceChange24h ? 
    `${parseFloat(String(coin.priceChange24h)).toFixed(2)}%` : 
    (coin.marketCapDelta24h ? 
      `${parseFloat(String(coin.marketCapDelta24h)).toFixed(2)}%` : 
      "N/A");

  const isPricePositive = 
    (coin.priceChange24h && parseFloat(String(coin.priceChange24h)) > 0) || 
    (coin.marketCapDelta24h && parseFloat(String(coin.marketCapDelta24h)) > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{coin.name} ({coin.symbol})</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{coin.description || "No description available"}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Total Supply</div>
            <div className="font-medium">{coin.totalSupply || "Unknown"}</div>
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Market Cap</div>
            <div className="font-medium">{coin.marketCap ? `${parseFloat(String(coin.marketCap)).toLocaleString()} USD` : "Unknown"}</div>
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">24h Volume</div>
            <div className="font-medium">{coin.volume24h ? `${parseFloat(String(coin.volume24h)).toLocaleString()} USD` : "Unknown"}</div>
          </div>
          
          <div className={`p-3 rounded-lg ${isPricePositive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            <div className="text-sm text-muted-foreground">24h Price Change</div>
            <div className={`font-medium ${isPricePositive ? 'text-green-500' : 'text-red-500'}`}>
              {priceChange}
            </div>
          </div>
        </div>
        
        {coin.createdAt && (
          <div className="text-sm text-muted-foreground">
            Created: {new Date(coin.createdAt).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
