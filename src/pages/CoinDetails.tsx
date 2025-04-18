
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowLeftRight, ExternalLink, Share2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useWallet } from '@/context/WalletContext';
import { fetchCoinDetails } from '@/services/coinService';
import CoinTradeDialog from '@/components/CoinTradeDialog';
import { formatEther } from 'viem';

export default function CoinDetailsPage() {
  const { address: coinAddress } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const { explorerUrl } = useWallet();
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false);
  
  const { data: coin, isLoading, error } = useQuery({
    queryKey: ['coin', coinAddress],
    queryFn: () => coinAddress ? fetchCoinDetails(coinAddress) : null,
    enabled: !!coinAddress
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold">Loading Coin...</h1>
        </div>
        <div className="animate-pulse">
          <div className="h-12 bg-muted rounded mb-4 w-1/3"></div>
          <div className="h-64 bg-muted rounded mb-6"></div>
          <div className="h-32 bg-muted rounded mb-6"></div>
        </div>
      </div>
    );
  }
  
  if (error || !coin) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold">Coin Not Found</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">The coin you're looking for couldn't be found or an error occurred.</p>
            <Button onClick={() => navigate('/coins')}>Go to Coins Page</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format market cap
  const formattedMarketCap = typeof coin.marketCap === 'string' 
    ? coin.marketCap 
    : formatEther(BigInt(coin.marketCap || '0'));
    
  // Format volume
  const formattedVolume = typeof coin.volume24h === 'string' 
    ? coin.volume24h 
    : formatEther(BigInt(coin.volume24h || '0'));

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate('/coins')} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Coins
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}
          >
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <a 
              href={`${explorerUrl}/address/${coin.address}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" /> View on Explorer
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">{coin.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-medium text-muted-foreground">${coin.symbol}</span>
                    {coin.priceChange24h && (
                      <span className={`text-sm ${parseFloat(String(coin.priceChange24h)) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {parseFloat(String(coin.priceChange24h)) >= 0 ? '↑' : '↓'} 
                        {Math.abs(parseFloat(String(coin.priceChange24h))).toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>
                {coin.mediaContent?.image && (
                  <div className="h-16 w-16 rounded-full overflow-hidden">
                    <img 
                      src={coin.mediaContent.image} 
                      alt={coin.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-lg font-medium">{formattedMarketCap} ETH</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                  <p className="text-lg font-medium">{formattedVolume} ETH</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Holders</p>
                  <p className="text-lg font-medium">{coin.uniqueHolders || 'N/A'}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-muted-foreground">
                  {coin.description || `${coin.name} is a Zora coin created on the Base network.`}
                </p>
              </div>
              
              {coin.creatorAddress && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">Creator</h2>
                  <div className="flex items-center">
                    <div className="bg-muted rounded-full p-2 mr-3">
                      <User className="h-5 w-5" />
                    </div>
                    <a 
                      href={`${explorerUrl}/address/${coin.creatorAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      {coin.creatorAddress.substring(0, 8)}...{coin.creatorAddress.substring(36)}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Trade {coin.symbol}</h2>
              <Button 
                className="w-full mb-4" 
                onClick={() => setIsTradeDialogOpen(true)}
              >
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Buy/Sell {coin.symbol}
              </Button>
              
              <div className="space-y-4 mt-6">
                <div>
                  <p className="text-sm text-muted-foreground">Contract Address</p>
                  <p className="font-mono text-sm break-all">{coin.address}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p>{new Date(coin.createdAt || '').toLocaleDateString()}</p>
                </div>
                
                {coin.payoutRecipient && (
                  <div>
                    <p className="text-sm text-muted-foreground">Payout Recipient</p>
                    <a 
                      href={`${explorerUrl}/address/${coin.payoutRecipient}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm font-mono"
                    >
                      {coin.payoutRecipient}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="trades" className="w-full">
        <TabsList>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="holders">Holders</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trades" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Recent trades will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="holders" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Coin holders will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Coin events and transactions will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CoinTradeDialog
        open={isTradeDialogOpen}
        onOpenChange={setIsTradeDialogOpen}
        selectedCoin={coin}
      />
    </div>
  );
}
