
import React from 'react';
import { NFTView } from '@/types/nft';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  view: NFTView;
  onViewChange: (view: NFTView) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center gap-2 bg-muted rounded-md p-1">
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        className={`px-3 py-1 h-auto ${view === 'grid' ? 'base-gradient text-white' : 'text-muted-foreground'}`}
        onClick={() => onViewChange('grid')}
      >
        <LayoutGrid className="h-4 w-4 mr-1" />
        Grid
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        className={`px-3 py-1 h-auto ${view === 'list' ? 'base-gradient text-white' : 'text-muted-foreground'}`}
        onClick={() => onViewChange('list')}
      >
        <List className="h-4 w-4 mr-1" />
        List
      </Button>
    </div>
  );
};

export default ViewToggle;
