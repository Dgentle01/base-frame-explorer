
export interface Coin {
  address: string;
  name: string;
  symbol: string;
  description?: string;
  imageUrl?: string;
  totalSupply?: string | bigint;
  marketCap?: string | bigint;
  volume24h?: string | bigint;
  priceChange24h?: string | number;
  marketCapDelta24h?: string | number;
  priceChange5m?: string | number;
  priceChange1h?: string | number;
  priceChange4h?: string | number;
  createdAt?: string;
  creatorAddress?: string;
  payoutRecipient?: string;
  uniqueHolders?: number;
}
