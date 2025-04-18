import React, { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Wallet, Menu, X, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onSearch: (query: string) => void;
  onOpenWalletModal?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onOpenWalletModal }) => {
  const { isConnected, address, balance, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleWalletClick = () => {
    if (isConnected) {
      if (onOpenWalletModal) {
        onOpenWalletModal();
      }
    } else {
      connectWallet();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-4">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-primary mr-2">Base</div>
            <div className="text-2xl font-bold">NFT Explorer</div>
          </Link>
          <Link to="/coins">
            <Button variant="ghost" size="sm" className="gap-2">
              <Coins className="h-4 w-4" />
              <span className="hidden md:inline">Coins</span>
            </Button>
          </Link>
        </div>

        <div className="hidden md:block w-full max-w-md">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="search"
              placeholder="Search NFTs, artists, collections..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-full bg-muted">
                <span className="text-sm font-medium">{balance}</span>
              </div>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onClick={handleWalletClick}
              >
                <span className="text-sm font-medium">{formatAddress(address!)}</span>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleWalletClick} 
              className="base-gradient text-white"
              disabled={isConnecting}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </div>

        <button 
          className="md:hidden text-foreground"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden container mt-4 pb-4 flex flex-col gap-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="search"
              placeholder="Search NFTs, artists, collections..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>

          {isConnected ? (
            <div className="flex flex-col gap-2">
              <div className="px-4 py-2 rounded-full bg-muted text-center">
                <span className="text-sm font-medium">{balance}</span>
              </div>
              <Button 
                variant="ghost" 
                className="flex items-center justify-center gap-2"
                onClick={handleWalletClick}
              >
                <span className="text-sm font-medium">{formatAddress(address!)}</span>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleWalletClick} 
              className="base-gradient text-white w-full"
              disabled={isConnecting}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
