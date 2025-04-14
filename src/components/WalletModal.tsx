
import React from 'react';
import { useWallet } from '@/context/WalletContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { isConnected, address, balance, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const { toast } = useToast();

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address.replace('...', ''));
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isConnected ? "Wallet Connected" : "Connect Wallet"}
          </DialogTitle>
          <DialogDescription>
            {isConnected 
              ? "Your wallet is connected to Base Network" 
              : "Connect your wallet to interact with NFTs on Base Network"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isConnected ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-muted-foreground">Address</div>
                  <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="font-medium break-all">{address}</div>
              </div>
              
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-muted-foreground">Balance</div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-xs">Base Network</span>
                  </div>
                </div>
                <div className="font-medium">{balance}</div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleDisconnect}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  asChild
                >
                  <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Explorer
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="p-6 flex-col h-auto space-y-2 bg-muted hover:bg-muted/80 text-foreground border border-border"
                  onClick={connectWallet}
                  disabled={isConnecting}
                >
                  <img 
                    src="https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/f6d76/eth-diamond-black.png" 
                    alt="Ethereum" 
                    className="h-12 w-12 object-contain"
                  />
                  <span>Ethereum</span>
                </Button>
                <Button 
                  className="p-6 flex-col h-auto space-y-2 bg-muted hover:bg-muted/80 text-foreground border border-border"
                  onClick={connectWallet}
                  disabled={isConnecting}
                >
                  <img 
                    src="https://raw.githubusercontent.com/Rainbow-me/rainbowkit/main/site/public/rainbow.svg" 
                    alt="Rainbow" 
                    className="h-12 w-12 object-contain"
                  />
                  <span>Rainbow</span>
                </Button>
                <Button 
                  className="p-6 flex-col h-auto space-y-2 bg-muted hover:bg-muted/80 text-foreground border border-border"
                  onClick={connectWallet}
                  disabled={isConnecting}
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png" 
                    alt="MetaMask" 
                    className="h-12 w-12 object-contain"
                  />
                  <span>MetaMask</span>
                </Button>
                <Button 
                  className="p-6 flex-col h-auto space-y-2 bg-muted hover:bg-muted/80 text-foreground border border-border"
                  onClick={connectWallet}
                  disabled={isConnecting}
                >
                  <img 
                    src="https://assets-global.website-files.com/618e9316785b3582a5178502/61f947b901275bfcbfc89673_walletconnect-logo.svg" 
                    alt="WalletConnect" 
                    className="h-12 w-12 object-contain"
                  />
                  <span>WalletConnect</span>
                </Button>
              </div>
              
              <Button 
                className="w-full base-gradient text-white"
                onClick={connectWallet}
                disabled={isConnecting}
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;
