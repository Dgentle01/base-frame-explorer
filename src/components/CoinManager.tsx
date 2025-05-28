
import React, { useState, useEffect } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { base } from "viem/chains";
import {
  getCoinsTopGainers,
  getCoinsTopVolume24h,
  getCoinsMostValuable,
  getCoinsNew,
  createCoin,
  type CreateCoinArgs,
} from "@zoralabs/coins-sdk";

export default function CoinManager() {
  // 1️⃣ Wallet & RPC clients
  const { address } = useAccount();
  const publicClient = usePublicClient({ chainId: base.id });
  const { data: walletClient } = useWalletClient();

  // 2️⃣ UI state for category selection and coin list
  const [category, setCategory] = useState<string>("Top Gainers");
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 3️⃣ Form state for creating a new coin
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [uri, setUri] = useState<string>("");
  const [payoutRecipient, setPayoutRecipient] = useState<string>("");
  // Fix for the BigInt type
  const [initialPurchaseWei, setInitialPurchaseWei] = useState<bigint>(BigInt(0));

  // 4️⃣ Fetch coins whenever `category` changes
  useEffect(() => {
    setLoading(true);
    // Determine which SDK explore query to run
    let fetcher: Promise<any[]>;
    switch (category) {
      case "Top Gainers":
        fetcher = getCoinsTopGainers({ count: 10 })
          .then(r => r.data?.exploreList?.edges.map(e => e.node) || []);
        break;
      case "Top Volume":
        fetcher = getCoinsTopVolume24h({ count: 10 })
          .then(r => r.data?.exploreList?.edges.map(e => e.node) || []);
        break;
      case "Most Valuable":
        fetcher = getCoinsMostValuable({ count: 10 })
          .then(r => r.data?.exploreList?.edges.map(e => e.node) || []);
        break;
      case "New Coins":
        fetcher = getCoinsNew({ count: 10 })
          .then(r => r.data?.exploreList?.edges.map(e => e.node) || []);
        break;
      default:
        fetcher = Promise.resolve([]);
    }
    fetcher
      .then(setCoins)
      .finally(() => setLoading(false));
  }, [category]);

  // 5️⃣ Handle new coin deployment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !walletClient) {
      alert("Please connect your wallet."); 
      return;
    }

    // Prepare arguments for createCoin
    const args: CreateCoinArgs = {
      name,
      symbol,
      uri,
      payoutRecipient: payoutRecipient as `0x${string}`,
      initialPurchaseWei,
    };

    try {
      const { hash, address: coinAddress } = await createCoin(
        args,
        walletClient,
        publicClient
      );
      alert(`Deployed! TX Hash: ${hash}\nNew Coin Address: ${coinAddress}`);
    } catch (err) {
      console.error(err);
      alert("Error deploying coin. Check console for details.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Zora Coin Manager</h1>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6">
        {["Top Gainers", "Top Volume", "Most Valuable", "New Coins"].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded ${
              category === cat ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Coin List */}
      {loading ? (
        <p>Loading coins…</p>
      ) : (
        <ul className="space-y-3 mb-8">
          {coins.map(c => (
            <li key={c.address} className="border p-3 rounded">
              <strong>{c.name} ({c.symbol})</strong><br/>
              Market Cap: {c.marketCap}<br/>
              24h Volume: {c.volume24h}
            </li>
          ))}
        </ul>
      )}

      {/* Create Coin Form */}
      <h2 className="text-xl font-semibold mb-2">Create a New Coin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Symbol"
          value={symbol}
          onChange={e => setSymbol(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Metadata URI (e.g. ipfs://...)"
          value={uri}
          onChange={e => setUri(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Payout Recipient Address"
          value={payoutRecipient}
          onChange={e => setPayoutRecipient(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Initial Purchase (Wei)"
          value={initialPurchaseWei.toString()}
          onChange={e => {
            try {
              // Safely parse the input to BigInt
              const value = e.target.value.trim() === '' ? '0' : e.target.value;
              setInitialPurchaseWei(BigInt(value));
            } catch (err) {
              console.error("Invalid BigInt value:", e.target.value);
            }
          }}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Deploy Coin
        </button>
      </form>
    </div>
  );
}
