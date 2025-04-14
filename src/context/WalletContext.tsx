
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock connection data
      setIsConnected(true);
      setAddress('0x1234...5678');
      setBalance('1.25 ETH');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance(null);
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        isConnecting,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
