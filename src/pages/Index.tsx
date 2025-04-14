
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NFTGridSection from '@/components/NFTGridSection';
import SearchBar from '@/components/SearchBar';
import SearchFilters from '@/components/SearchFilters';
import ViewToggle from '@/components/ViewToggle';
import NFTDetail from '@/components/NFTDetail';
import WalletModal from '@/components/WalletModal';
import { Button } from '@/components/ui/button';
import { Filter, ArrowUpDown } from 'lucide-react';
import { NFT, NFTView, NFTFilterOptions } from '@/types/nft';
import { nftService } from '@/services/nftService';
import { WalletProvider } from '@/context/WalletContext';

const Index = () => {
  const [trendingNFTs, setTrendingNFTs] = useState<NFT[]>([]);
  const [newlyMintedNFTs, setNewlyMintedNFTs] = useState<NFT[]>([]);
  const [highestMarketCapNFTs, setHighestMarketCapNFTs] = useState<NFT[]>([]);
  const [searchResults, setSearchResults] = useState<NFT[]>([]);
  const [activeFilters, setActiveFilters] = useState<NFTFilterOptions | null>(null);
  const [view, setView] = useState<NFTView>('grid');
  const [loading, setLoading] = useState({
    trending: true,
    newlyMinted: true,
    highestMarketCap: true,
    search: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isNFTDetailOpen, setIsNFTDetailOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const trending = nftService.getTrendingNFTs();
        const newlyMinted = nftService.getNewlyMintedNFTs();
        const highestMarketCap = nftService.getHighestMarketCapNFTs();

        setTrendingNFTs(await trending);
        setNewlyMintedNFTs(await newlyMinted);
        setHighestMarketCapNFTs(await highestMarketCap);
      } catch (error) {
        console.error('Error fetching NFT data:', error);
      } finally {
        setLoading({
          trending: false,
          newlyMinted: false,
          highestMarketCap: false,
          search: false
        });
      }
    };

    fetchData();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(prev => ({ ...prev, search: true }));
    try {
      const results = await nftService.searchNFTs(query, activeFilters || undefined);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching NFTs:', error);
    } finally {
      setLoading(prev => ({ ...prev, search: false }));
    }
  }, [activeFilters]);

  const handleApplyFilters = async (filters: NFTFilterOptions) => {
    setActiveFilters(filters);
    if (searchQuery) {
      setLoading(prev => ({ ...prev, search: true }));
      try {
        const results = await nftService.searchNFTs(searchQuery, filters);
        setSearchResults(results);
      } catch (error) {
        console.error('Error filtering NFTs:', error);
      } finally {
        setLoading(prev => ({ ...prev, search: false }));
      }
    }
  };

  const handleClearFilters = async () => {
    setActiveFilters(null);
    if (searchQuery) {
      setLoading(prev => ({ ...prev, search: true }));
      try {
        const results = await nftService.searchNFTs(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error resetting filters:', error);
      } finally {
        setLoading(prev => ({ ...prev, search: false }));
      }
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const nft = await nftService.getNFTById(id);
      if (nft) {
        setSelectedNFT(nft);
        setIsNFTDetailOpen(true);
      }
    } catch (error) {
      console.error('Error fetching NFT details:', error);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleWalletModal = () => {
    setIsWalletModalOpen(!isWalletModalOpen);
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <WalletProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header onSearch={handleSearch} />
        
        <main className="flex-1 container py-6">
          {/* Hero Section */}
          {!isSearching && (
            <div className="rounded-xl overflow-hidden mb-10 relative">
              <div className="absolute inset-0 base-gradient opacity-90"></div>
              <div className="relative z-10 p-8 md:p-12 flex flex-col items-center md:items-start text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center md:text-left">
                  Discover, Collect & Mint <br /> NFTs on Base Network
                </h1>
                <p className="text-lg mb-6 max-w-lg text-center md:text-left">
                  Explore the latest trending NFTs with real-time market data and connect your wallet to start your collection.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-white/90"
                    onClick={toggleWalletModal}
                  >
                    Connect Wallet
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-white border-white hover:bg-white/10"
                  >
                    Explore Collections
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters Bar */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
              <div className="w-full md:w-auto">
                <h2 className="text-2xl font-bold mb-2">
                  {isSearching ? 'Search Results' : 'Explore NFTs'}
                </h2>
                {isSearching && (
                  <p className="text-muted-foreground">
                    Showing results for "{searchQuery}"
                  </p>
                )}
              </div>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <SearchBar onSearch={handleSearch} />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleFilters}
                    className={showFilters ? 'bg-muted' : ''}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                  <ViewToggle view={view} onViewChange={setView} />
                </div>
              </div>
            </div>

            {/* Filters Section */}
            {showFilters && (
              <div className="mt-4 mb-6">
                <SearchFilters 
                  onApplyFilters={handleApplyFilters} 
                  onClearFilters={handleClearFilters}
                />
              </div>
            )}
          </div>

          {/* Search Results */}
          {isSearching && (
            <NFTGridSection
              title=""
              nfts={searchResults}
              loading={loading.search}
              onViewDetails={handleViewDetails}
              view={view}
            />
          )}

          {/* NFT Sections (only shown when not searching) */}
          {!isSearching && (
            <>
              <NFTGridSection
                title="Trending NFTs"
                description="The most popular NFTs in the last 24 hours"
                nfts={trendingNFTs}
                loading={loading.trending}
                showViewAll
                onViewAll={() => console.log('View all trending')}
                onViewDetails={handleViewDetails}
                view={view}
              />

              <NFTGridSection
                title="Newly Minted"
                description="Fresh NFTs hot off the blockchain"
                nfts={newlyMintedNFTs}
                loading={loading.newlyMinted}
                showViewAll
                onViewAll={() => console.log('View all newly minted')}
                onViewDetails={handleViewDetails}
                view={view}
              />

              <NFTGridSection
                title="Highest Market Cap"
                description="NFTs with the highest market capitalization"
                nfts={highestMarketCapNFTs}
                loading={loading.highestMarketCap}
                showViewAll
                onViewAll={() => console.log('View all highest market cap')}
                onViewDetails={handleViewDetails}
                view={view}
              />
            </>
          )}

          {/* Empty State */}
          {isSearching && searchResults.length === 0 && !loading.search && (
            <div className="py-16 text-center">
              <h3 className="text-xl font-medium mb-2">No NFTs found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          )}
        </main>

        <Footer />

        {/* NFT Detail Modal */}
        <NFTDetail
          nft={selectedNFT}
          isOpen={isNFTDetailOpen}
          onClose={() => setIsNFTDetailOpen(false)}
        />

        {/* Wallet Modal */}
        <WalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
        />
      </div>
    </WalletProvider>
  );
};

export default Index;
