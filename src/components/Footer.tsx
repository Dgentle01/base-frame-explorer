
import React from 'react';
import { Button } from '@/components/ui/button';
import { Twitter, Github, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-2">
              <div className="text-xl font-bold text-primary mr-1">Base</div>
              <div className="text-xl font-bold">NFT Explorer</div>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Explore, collect, and mint NFTs on the Base network
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="https://base.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                Base <ExternalLink size={14} />
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://zora.co" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                Zora <ExternalLink size={14} />
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://warpcast.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                Farcaster <ExternalLink size={14} />
              </a>
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter size={16} />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github size={16} />
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">
            © {new Date().getFullYear()} Base NFT Explorer. All NFT data is provided for educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
