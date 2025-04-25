import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Clock, DollarSign, ExternalLink, Users } from "lucide-react";
import { formatEther, formatUnits } from 'viem';
import { useWallet } from '@/context/WalletContext';
import { Coin } from '@/types/coin';

interface CoinDetailsCardProps {
  coin: Coin;
  onTrade: () => void;
}

export default function CoinDetailsCard({ coin, onTrade }: CoinDetailsCardProps) {
  const { explorerUrl } = useWallet();
  
  const formattedDate = coin.createdAt ? new Date(coin.createdAt).toLocaleDateString() : 'Unknown';
  
  const formattedMarketCap = typeof coin.marketCap === 'bigint' 
    ? formatEther(coin.marketCap) 
    : (typeof coin.marketCap === 'string' ? coin.marketCap : '0');
    
  const formattedVolume = typeof coin.volume24h === 'bigint'
    ? formatEther(coin.volume24h)
    : (typeof coin.volume24h === 'string' ? coin.volume24h : '0');
    
  const formattedSupply = typeof coin.totalSupply === 'bigint'
    ? formatUnits(coin.totalSupply, 18)
    : (typeof coin.totalSupply === 'string' ? coin.totalSupply : '0');
  
  const formatPriceChange = (value: string | number | undefined) => {
    if (!value || isNaN(Number(value))) return 'N/A';
    const numValue = parseFloat(String(value));
    return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(2)}%`;
  };

  const getPriceChangeColor = (value: string | number | undefined) => {
    if (!value || isNaN(Number(value))) return 'text-muted-foreground';
    return parseFloat(String(value)) >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {coin.name} 
              <Badge variant="outline">{coin.symbol}</Badge>
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {coin.description || `A Zora Coin created on the Base network`}
            </CardDescription>
          </div>
          
          {coin.imageUrl ? (
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <img 
                src={coin.imageUrl} 
                alt={coin.name} 
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              Market Cap
            </p>
            <p className="font-medium">{formattedMarketCap} ETH</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              24h Volume
            </p>
            <p className="font-medium">{formattedVolume} ETH</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              Holders
            </p>
            <p className="font-medium">{coin.uniqueHolders || 'Unknown'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Created
            </p>
            <p className="font-medium">{formattedDate}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">5m</p>
              <p className={getPriceChangeColor(coin.priceChange5m)}>
                {formatPriceChange(coin.priceChange5m)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">1h</p>
              <p className={getPriceChangeColor(coin.priceChange1h)}>
                {formatPriceChange(coin.priceChange1h)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">4h</p>
              <p className={getPriceChangeColor(coin.priceChange4h)}>
                {formatPriceChange(coin.priceChange4h)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-2 border-t">
        <Button 
          variant="default" 
          className="flex-1"
          onClick={onTrade}
        >
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          Trade
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          asChild
        >
          <a 
            href={`${explorerUrl}/address/${coin.address}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
