import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Clock, DollarSign, ExternalLink, Users } from "lucide-react";
import { formatEther, formatUnits } from 'viem';
import { useWallet } from '@/context/WalletContext';

interface CoinDetailsCardProps {
  coin: {
    address: string;
    name: string;
    symbol: string;
    description?: string;
    image?: string;
    totalSupply?: string | bigint;
    marketCap?: string | bigint;
    volume24h?: string | bigint;
    priceChange24h?: string | number;
    marketCapDelta24h?: string | number;
    createdAt?: string;
    creatorAddress?: string;
    payoutRecipient?: string;
    uniqueHolders?: number;
  };
  onTrade: () => void;
}

export default function CoinDetailsCard({ coin, onTrade }: CoinDetailsCardProps) {
  const { explorerUrl } = useWallet();
  
  // Format dates
  const formattedDate = coin.createdAt ? new Date(coin.createdAt).toLocaleDateString() : 'Unknown';
  
  // Format numbers
  const formattedMarketCap = typeof coin.marketCap === 'bigint' 
    ? formatEther(coin.marketCap) 
    : (typeof coin.marketCap === 'string' ? coin.marketCap : '0');
    
  const formattedVolume = typeof coin.volume24h === 'bigint'
    ? formatEther(coin.volume24h)
    : (typeof coin.volume24h === 'string' ? coin.volume24h : '0');
    
  const formattedSupply = typeof coin.totalSupply === 'bigint'
    ? formatUnits(coin.totalSupply, 18)
    : (typeof coin.totalSupply === 'string' ? coin.totalSupply : '0');
  
  // Format price change with a more robust approach
  const getPriceChange = () => {
    // First try to use priceChange24h
    if (coin.priceChange24h && !isNaN(parseFloat(String(coin.priceChange24h)))) {
      return parseFloat(String(coin.priceChange24h));
    }
    // Fall back to marketCapDelta24h if available
    else if (coin.marketCapDelta24h && !isNaN(parseFloat(String(coin.marketCapDelta24h)))) {
      return parseFloat(String(coin.marketCapDelta24h));
    }
    // Default to 0 if neither is available or valid
    return 0;
  };
  
  const priceChange = getPriceChange();
  const priceChangeColor = priceChange >= 0 ? 'text-green-500' : 'text-red-500';
  const priceChangePrefix = priceChange >= 0 ? '+' : '';
  const priceChangeValue = `${priceChangePrefix}${priceChange.toFixed(2)}%`;

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
          
          {coin.image && (
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <img 
                src={coin.image} 
                alt={coin.name} 
                className="h-full w-full object-cover"
              />
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
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">24h Change</p>
              <p className={`font-medium ${priceChangeColor}`}>{priceChangeValue}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Supply</p>
              <p className="font-medium">{formattedSupply}</p>
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
