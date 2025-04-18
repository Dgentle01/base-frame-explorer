
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CoinDetailsCard from '@/components/CoinDetailsCard';
import { fetchCoinDetails } from '@/services/coinService';
import CoinTradeDialog from '@/components/CoinTradeDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallet } from '@/context/WalletContext';

export default function CoinDetailsPage() {
  const { address } = useParams<{ address: string }>();
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false);
  const { isConnected } = useWallet();
  
  const { data: coin, isLoading, error } = useQuery({
    queryKey: ['coin', address],
    queryFn: () => fetchCoinDetails(address || ''),
    enabled: !!address
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-muted rounded-full mb-4"></div>
          <div className="h-8 w-64 bg-muted rounded mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error || !coin) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link to="/coins">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Coins
            </Link>
          </Button>
        </div>
        
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Coin Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">The requested coin could not be found or loaded.</p>
            <Button asChild>
              <Link to="/coins">
                <Coins className="h-4 w-4 mr-2" />
                Explore Coins
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is a creator
  const isCreator = coin.creatorAddress && address && coin.creatorAddress.toLowerCase() === address.toLowerCase();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/coins">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Coins
          </Link>
        </Button>
        
        <div className="flex gap-2">
          {isConnected && (
            <>
              <Button 
                variant="outline"
                onClick={() => setIsTradeDialogOpen(true)}
              >
                <Coins className="h-4 w-4 mr-2" />
                Trade
              </Button>
              {isCreator && (
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CoinDetailsCard 
            coin={coin}
            onTrade={() => setIsTradeDialogOpen(true)}
          />
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Recent trades will appear here.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <CoinTradeDialog
        open={isTradeDialogOpen}
        onOpenChange={setIsTradeDialogOpen}
        selectedCoin={coin}
      />
    </div>
  );
}
