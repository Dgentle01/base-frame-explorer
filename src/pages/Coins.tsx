
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Coins, ArrowUpDown, TrendingUp, Clock, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateCoinDialog from '@/components/CreateCoinDialog';
import { 
  fetchTopGainers, 
  fetchTopVolume, 
  fetchMostValuable, 
  fetchNewCoins 
} from '@/services/coinService';
import { useWallet } from '@/context/WalletContext';
import CoinTradeDialog from '@/components/CoinTradeDialog';

export default function CoinsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isTradeDialogOpen, setIsTradeDialogOpen] = React.useState(false);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const { isConnected } = useWallet();
  
  const { data: topGainers, isLoading: loadingGainers } = useQuery({
    queryKey: ['coins', 'topGainers'],
    queryFn: () => fetchTopGainers(5)
  });

  const { data: topVolume, isLoading: loadingVolume } = useQuery({
    queryKey: ['coins', 'topVolume'],
    queryFn: () => fetchTopVolume(5)
  });

  const { data: mostValuable, isLoading: loadingMostValuable } = useQuery({
    queryKey: ['coins', 'mostValuable'],
    queryFn: () => fetchMostValuable(5)
  });

  const { data: newCoins, isLoading: loadingNewCoins } = useQuery({
    queryKey: ['coins', 'newCoins'],
    queryFn: () => fetchNewCoins(5)
  });

  const handleTradeCoin = (coin: any) => {
    setSelectedCoin(coin);
    setIsTradeDialogOpen(true);
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Zora Coins</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsTradeDialogOpen(true)} className="gap-2" variant="outline">
            <ArrowUpDown className="h-4 w-4" />
            Trade Coin
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Coin
          </Button>
        </div>
      </div>

      <Tabs defaultValue="explore">
        <TabsList className="mb-4">
          <TabsTrigger value="explore">
            <Coins className="h-4 w-4 mr-2" />
            Explore
          </TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="new">
            <Clock className="h-4 w-4 mr-2" />
            New
          </TabsTrigger>
          {isConnected && (
            <TabsTrigger value="portfolio">
              <Wallet className="h-4 w-4 mr-2" />
              Portfolio
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="explore" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Top Gainers</h2>
              {loadingGainers ? (
                <p>Loading...</p>
              ) : (
                <ul className="space-y-2">
                  {topGainers?.map((coin) => (
                    <li 
                      key={coin.address} 
                      className="flex justify-between items-center p-2 hover:bg-accent rounded cursor-pointer"
                      onClick={() => handleTradeCoin(coin)}
                    >
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
                    <li 
                      key={coin.address} 
                      className="flex justify-between items-center p-2 hover:bg-accent rounded cursor-pointer"
                      onClick={() => handleTradeCoin(coin)}
                    >
                      <span>{coin.name}</span>
                      <span className="text-muted-foreground">{coin.volume24h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Most Valuable</h2>
              {loadingMostValuable ? (
                <p>Loading...</p>
              ) : (
                <ul className="space-y-2">
                  {mostValuable?.map((coin) => (
                    <li 
                      key={coin.address} 
                      className="flex justify-between items-center p-2 hover:bg-accent rounded cursor-pointer"
                      onClick={() => handleTradeCoin(coin)}
                    >
                      <span>{coin.name}</span>
                      <span className="text-muted-foreground">{coin.marketCap}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Top Gainers</h2>
              {loadingGainers ? (
                <p>Loading...</p>
              ) : (
                <ul className="space-y-2">
                  {topGainers?.map((coin) => (
                    <li 
                      key={coin.address} 
                      className="flex justify-between items-center p-2 hover:bg-accent rounded cursor-pointer"
                      onClick={() => handleTradeCoin(coin)}
                    >
                      <span>{coin.name}</span>
                      <span className="text-green-500">+{coin.priceChange24h}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">New Coins</h2>
            {loadingNewCoins ? (
              <p>Loading...</p>
            ) : (
              <ul className="space-y-2">
                {newCoins?.map((coin) => (
                  <li 
                    key={coin.address} 
                    className="flex justify-between items-center p-2 hover:bg-accent rounded cursor-pointer"
                    onClick={() => handleTradeCoin(coin)}
                  >
                    <div>
                      <span className="font-medium">{coin.name}</span>
                      <span className="text-muted-foreground ml-2 text-sm">({coin.symbol})</span>
                    </div>
                    <span className="text-muted-foreground text-sm">{new Date(coin.createdAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          {isConnected ? (
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Your Coins</h2>
              <p className="text-muted-foreground">Connect your wallet to view your coin holdings.</p>
            </Card>
          ) : (
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Connect Wallet</h2>
              <p className="text-muted-foreground">Please connect your wallet to view your portfolio</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <CreateCoinDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <CoinTradeDialog
        open={isTradeDialogOpen}
        onOpenChange={setIsTradeDialogOpen}
        selectedCoin={selectedCoin}
      />
    </div>
  );
}
