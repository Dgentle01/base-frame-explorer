
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useWallet } from '@/context/WalletContext';
import { Wallet } from 'lucide-react';

export default function WalletInfo() {
  const { address, balance, isConnected } = useWallet();
  
  if (!isConnected) {
    return null;
  }

  const formatAddress = (addr: string | null): string => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <Card className="bg-muted/50">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Connected Wallet</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{formatAddress(address)}</span>
          <div className="px-3 py-1 rounded-full bg-muted">
            <span className="text-sm font-medium">{balance}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
