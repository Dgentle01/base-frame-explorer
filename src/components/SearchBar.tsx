
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { nftService } from '@/services/nftService';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleSearch = (searchQuery = query) => {
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleClearQuery = () => {
    setQuery('');
    setSuggestions([]);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await nftService.getNFTSuggestions(query);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="search"
          placeholder="Search NFTs, artists, collections..."
          className="pl-10 pr-10"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        
        {query && (
          <button
            type="button"
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={handleClearQuery}
          >
            <X size={16} />
          </button>
        )}
        
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-10 p-0"
        >
          {loading ? (
            <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          ) : (
            "Go"
          )}
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-card rounded-md shadow-lg border border-border overflow-hidden">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-muted text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
