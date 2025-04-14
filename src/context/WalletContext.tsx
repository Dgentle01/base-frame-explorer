
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ethers } from 'ethers';

// Base network configuration
const BASE_NETWORK = {
  chainId: 8453, // Base Mainnet
  chainName: 'Base',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org']
};

// Base testnet configuration (for development)
const BASE_TESTNET = {
  chainId: 84531, // Base Goerli Testnet
  chainName: 'Base Goerli',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://goerli.base.org'],
  blockExplorerUrls: ['https://goerli.basescan.org']
};

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  provider: ethers.providers.Web3Provider | null;
  network: typeof BASE_NETWORK;
  chainId: number | null;
  explorerUrl: string;
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
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  
  // Use mainnet by default, change to BASE_TESTNET for development if needed
  const network = BASE_NETWORK;
  const explorerUrl = network.blockExplorerUrls[0];

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (window.ethereum) {
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          
          if (accounts && accounts.length > 0) {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(web3Provider);
            
            // Get network information
            const network = await web3Provider.getNetwork();
            setChainId(network.chainId);
            
            // Set address
            setAddress(accounts[0]);
            setIsConnected(true);
            
            // Get and format balance
            await updateBalance(web3Provider, accounts[0]);
          }
        } catch (error) {
          console.error('Failed to check existing connection:', error);
        }
      }
    };
    
    checkExistingConnection();
  }, []);
  
  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          disconnectWallet();
        } else if (accounts[0] !== address) {
          // Account changed
          setAddress(accounts[0]);
          if (provider) {
            await updateBalance(provider, accounts[0]);
          }
        }
      };
      
      const handleChainChanged = (chainIdHex: string) => {
        // Force page refresh on chain change as recommended by MetaMask
        window.location.reload();
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [address, provider]);
  
  const updateBalance = async (provider: ethers.providers.Web3Provider, address: string) => {
    try {
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.utils.formatEther(balanceWei);
      // Format to max 4 decimal places
      const formattedBalance = parseFloat(balanceEth).toFixed(4);
      setBalance(`${formattedBalance} ETH`);
    } catch (error) {
      console.error('Error getting balance:', error);
      setBalance('Error');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.error('No Ethereum wallet detected');
      alert('No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.');
      return;
    }
    
    try {
      setIsConnecting(true);
      
      // Request accounts access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      // Initialize ethers provider
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      
      // Get network info
      const network = await web3Provider.getNetwork();
      setChainId(network.chainId);
      
      // Check if we need to switch networks
      if (network.chainId !== BASE_NETWORK.chainId) {
        try {
          // Try to switch to Base network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${BASE_NETWORK.chainId.toString(16)}` }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: `0x${BASE_NETWORK.chainId.toString(16)}`,
                  chainName: BASE_NETWORK.chainName,
                  nativeCurrency: BASE_NETWORK.nativeCurrency,
                  rpcUrls: BASE_NETWORK.rpcUrls,
                  blockExplorerUrls: BASE_NETWORK.blockExplorerUrls
                }],
              });
            } catch (addError) {
              console.error('Failed to add Base network:', addError);
              throw addError;
            }
          } else {
            console.error('Failed to switch to Base network:', switchError);
            throw switchError;
          }
        }
      }
      
      // Set address and connection status
      setAddress(accounts[0]);
      setIsConnected(true);
      
      // Get balance
      await updateBalance(web3Provider, accounts[0]);
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
    setProvider(null);
    setChainId(null);
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        isConnecting,
        connectWallet,
        disconnectWallet,
        provider,
        network,
        chainId,
        explorerUrl
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
