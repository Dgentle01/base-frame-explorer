import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Coins, ArrowUpDown, TrendingUp, Clock, Wallet, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateCoinDialog from '@/components/CreateCoinDialog';
import { 
  fetchTopGainers, 
  fetchTopVolume, 
  fetchMostValuable, 
  fetchNewCoins,
  fetchRecentlyTraded
} from '@/services/coinService';
import { useWallet } from '@/context/WalletContext';
import CoinTradeDialog from '@/components/CoinTradeDialog';
import CoinDetailsCard from '@/components/CoinDetailsCard';
import CoinSearch from '@/components/CoinSearch';

export default function CoinsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isTradeDialogOpen, setIsTradeDialogOpen] = React.useState(false);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  const { data: recentlyTraded, isLoading: loadingRecentlyTraded } = useQuery({
    queryKey: ['coins', 'recentlyTraded'],
    queryFn: () => fetchRecentlyTraded(5)
  });

  const handleTradeCoin = (coin: any) => {
    setSelectedCoin(coin);
    setIsTradeDialogOpen(true);
  };
  
  const filterCoins = (coins: any[]) => {
    if (!searchQuery) return coins;
    const query = searchQuery.toLowerCase();
    return coins?.filter(coin => 
      coin.name.toLowerCase().includes(query) || 
      coin.symbol.toLowerCase().includes(query)
    ) || [];
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Zora Coins</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsTradeDialogOpen(true)} className="gap-2" variant="outline">
              <ArrowLeftRight className="h-4 w-4" />
              Trade Coin
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Coin
            </Button>
          </div>
        </div>

        <div className="w-full max-w-md">
          <CoinSearch onSearch={setSearchQuery} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Top Gainers</h2>
                {loadingGainers ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse h-16 bg-muted rounded"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filterCoins(topGainers)?.map((coin) => (
                      <Link to={`/coins/${coin.address}`} key={coin.address}>
                        <Card className="hover:bg-muted/50 transition-colors">
                          <div className="p-4 flex justify-between items-center">
                            <div>
                              <p className="font-medium">{coin.name}</p>
                              <p className="text-sm text-muted-foreground">${coin.symbol}</p>
                            </div>
                            <span className="text-green-500">+{getPriceChange(coin)}%</span>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Top Volume</h2>
                {loadingVolume ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse h-16 bg-muted rounded"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filterCoins(topVolume)?.map((coin) => (
                      <Link to={`/coins/${coin.address}`} key={coin.address}>
                        <Card className="hover:bg-muted/50 transition-colors">
                          <div className="p-4 flex justify-between items-center">
                            <div>
                              <p className="font-medium">{coin.name}</p>
                              <p className="text-sm text-muted-foreground">${coin.symbol}</p>
                            </div>
                            <span className="text-muted-foreground">{coin.volume24h || '0'} ETH</span>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingMostValuable ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse h-64 bg-muted rounded"></div>
                ))
              ) : (
                mostValuable?.slice(0, 6).map((coin) => (
                  <CoinDetailsCard 
                    key={coin.address}
                    coin={coin}
                    onTrade={() => handleTradeCoin(coin)}
                  />
                ))
              )}
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Recently Traded</h2>
              {loadingRecentlyTraded ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse h-16 bg-muted rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterCoins(recentlyTraded)?.map((coin) => (
                    <Link to={`/coins/${coin.address}`} key={coin.address}>
                      <Card className="hover:bg-muted/50 transition-colors">
                        <div className="p-4">
                          <p className="font-medium">{coin.name}</p>
                          <div className="flex justify-between mt-1">
                            <p className="text-sm text-muted-foreground">${coin.symbol}</p>
                            <p className="text-sm">Vol: {coin.volume24h || '0'} ETH</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingNewCoins ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse h-64 bg-muted rounded"></div>
                ))
              ) : (
                newCoins?.map((coin) => (
                  <CoinDetailsCard 
                    key={coin.address}
                    coin={coin}
                    onTrade={() => handleTradeCoin(coin)}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            {isConnected ? (
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Your Coins</h2>
                <p className="text-muted-foreground">Your coin holdings will appear here once you have traded some coins.</p>
              </Card>
            ) : (
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Connect Wallet</h2>
                <p className="text-muted-foreground">Please connect your wallet to view your portfolio</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

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
