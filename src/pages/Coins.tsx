
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CreateCoinDialog from '@/components/CreateCoinDialog';
import { fetchTopGainers, fetchTopVolume, fetchMostValuable, fetchNewCoins } from '@/services/coinService';

export default function CoinsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  
  const { data: topGainers, isLoading: loadingGainers } = useQuery({
    queryKey: ['coins', 'topGainers'],
    queryFn: () => fetchTopGainers(5)
  });

  const { data: topVolume, isLoading: loadingVolume } = useQuery({
    queryKey: ['coins', 'topVolume'],
    queryFn: () => fetchTopVolume(5)
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Zora Coins</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Coin
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Top Gainers</h2>
          {loadingGainers ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-2">
              {topGainers?.map((coin) => (
                <li key={coin.address} className="flex justify-between items-center p-2 hover:bg-accent rounded">
                  <span>{coin.name}</span>
                  <span className="text-green-500">+{coin.priceChange24h}%</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Top Volume</h2>
          {loadingVolume ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-2">
              {topVolume?.map((coin) => (
                <li key={coin.address} className="flex justify-between items-center p-2 hover:bg-accent rounded">
                  <span>{coin.name}</span>
                  <span className="text-muted-foreground">{coin.volume24h}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <CreateCoinDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
