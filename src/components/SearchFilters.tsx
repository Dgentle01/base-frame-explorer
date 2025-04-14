
import React, { useState } from 'react';
import { NFTFilterOptions } from '@/types/nft';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, FilterX } from 'lucide-react';

interface SearchFiltersProps {
  onApplyFilters: (filters: NFTFilterOptions) => void;
  onClearFilters: () => void;
}

const categories = ['Art', 'Music', 'Photography', 'Collectible', 'Other'];

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  onApplyFilters, 
  onClearFilters 
}) => {
  const [filters, setFilters] = useState<NFTFilterOptions>({
    category: null,
    minPrice: null,
    maxPrice: null,
    mintDateStart: null,
    mintDateEnd: null,
    sortBy: 'date',
    sortDirection: 'desc'
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10]);

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      category: value
    }));
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    setFilters(prev => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1]
    }));
  };

  const handleMintDateStartChange = (date: Date | undefined) => {
    setFilters(prev => ({
      ...prev,
      mintDateStart: date ? date.toISOString() : null
    }));
  };

  const handleMintDateEndChange = (date: Date | undefined) => {
    setFilters(prev => ({
      ...prev,
      mintDateEnd: date ? date.toISOString() : null
    }));
  };

  const handleSortByChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value as NFTFilterOptions['sortBy']
    }));
  };

  const handleSortDirectionChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      sortDirection: value as NFTFilterOptions['sortDirection']
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: null,
      minPrice: null,
      maxPrice: null,
      mintDateStart: null,
      mintDateEnd: null,
      sortBy: 'date',
      sortDirection: 'desc'
    });
    setPriceRange([0, 10]);
    onClearFilters();
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearFilters}
          className="h-8 px-2 text-xs"
        >
          <FilterX className="h-3 w-3 mr-1" />
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="py-3 text-sm">Category</AccordionTrigger>
          <AccordionContent>
            <Select 
              value={filters.category || ''} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="py-3 text-sm">Price Range (ETH)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={[priceRange[0], priceRange[1]]}
                min={0}
                max={10}
                step={0.1}
                onValueChange={handlePriceRangeChange}
              />
              <div className="flex items-center justify-between gap-2">
                <div className="w-1/2">
                  <div className="text-xs text-muted-foreground mb-1">Min</div>
                  <Input
                    type="number"
                    min={0}
                    max={priceRange[1]}
                    step={0.1}
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= priceRange[1]) {
                        setPriceRange([value, priceRange[1]]);
                        setFilters(prev => ({
                          ...prev,
                          minPrice: value
                        }));
                      }
                    }}
                  />
                </div>
                <div className="w-1/2">
                  <div className="text-xs text-muted-foreground mb-1">Max</div>
                  <Input
                    type="number"
                    min={priceRange[0]}
                    max={10}
                    step={0.1}
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= priceRange[0]) {
                        setPriceRange([priceRange[0], value]);
                        setFilters(prev => ({
                          ...prev,
                          maxPrice: value
                        }));
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="date">
          <AccordionTrigger className="py-3 text-sm">Mint Date</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">From</div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.mintDateStart ? (
                        format(new Date(filters.mintDateStart), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.mintDateStart ? new Date(filters.mintDateStart) : undefined}
                      onSelect={handleMintDateStartChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">To</div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.mintDateEnd ? (
                        format(new Date(filters.mintDateEnd), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.mintDateEnd ? new Date(filters.mintDateEnd) : undefined}
                      onSelect={handleMintDateEndChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sort">
          <AccordionTrigger className="py-3 text-sm">Sort By</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <Select 
                value={filters.sortBy} 
                onValueChange={handleSortByChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="marketCap">Market Cap</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={filters.sortDirection} 
                onValueChange={handleSortDirectionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button 
        className="w-full mt-4 base-gradient text-white"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default SearchFilters;
