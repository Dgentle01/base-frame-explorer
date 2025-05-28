
import React, { useEffect, useState } from "react";
import { fetchTopGainers } from "../services/coinService";
import { Coin } from "@/types/coin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TopGainers() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchTopGainers(10)
      .then(data => setCoins(data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Gainers (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Gainers (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        {coins.length > 0 ? (
          <ul className="space-y-4">
            {coins.map((c, i) => (
              <li key={c.address} className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{i + 1}. {c.name} ({c.symbol})</span>
                    <div className="text-sm text-muted-foreground mt-1">
                      Market Cap: {c.marketCap ? `${parseFloat(String(c.marketCap)).toLocaleString()} USD` : "N/A"}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded ${(c.priceChange24h && parseFloat(String(c.priceChange24h)) > 0) || 
                     (c.marketCapDelta24h && parseFloat(String(c.marketCapDelta24h)) > 0) ? 
                     'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {c.priceChange24h 
                      ? `${parseFloat(String(c.priceChange24h)).toFixed(2)}%` 
                      : c.marketCapDelta24h 
                        ? `${parseFloat(String(c.marketCapDelta24h)).toFixed(2)}%`
                        : "N/A"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No top gainers data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
