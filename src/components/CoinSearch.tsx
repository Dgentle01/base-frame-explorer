
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CoinSearchProps {
  onSearch: (query: string) => void;
}

export function CoinSearch({ onSearch }: CoinSearchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-10 pr-4"
        placeholder="Search coins by name..."
        onChange={handleChange}
      />
    </div>
  );
}

export default CoinSearch;
