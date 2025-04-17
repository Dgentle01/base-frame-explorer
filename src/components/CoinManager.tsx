import React, { useState, useEffect } from "react";
// Wagmi hooks for wallet & RPC clients
import { useAccount, usePublicClient, useWalletClient } from "wagmi"; // :contentReference[oaicite:3]{index=3}
// Base chain config from viem
import { base } from "viem/chains";                                       // :contentReference[oaicite:4]{index=4}
import {
  // Explore queries
  getCoinsTopGainers,
  getCoinsTopVolume24h,
  getCoinsMostValuable,
  getCoinsNew,
  // Create coin (on‑chain write)
  createCoin,
  type CreateCoinArgs,
} from "@zoralabs/coins-sdk";                                            // :contentReference[oaicite:5]{index=5}

export default function CoinManager() {
  // 1️⃣ Wallet & RPC clients
  const { address } = useAccount();                          // Connected wallet address :contentReference[oaicite:6]{index=6}
  const publicClient = usePublicClient({ chainId: base.id }); // Read‑only RPC client on Base :contentReference[oaicite:7]{index=7}
  const { data: walletClient } = useWalletClient();           // Signer client for writes :contentReference[oaicite:8]{index=8}

  // 2️⃣ UI state for category selection and coin list
  const [category, setCategory] = useState<string>("Top Gainers");
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 3️⃣ Form state for creating a new coin
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [uri, setUri] = useState<string>("");                        // Metadata URI (IPFS recommended) :contentReference[oaicite:9]{index=9}
  const [payoutRecipient, setPayoutRecipient] = useState<string>("");
  const [initialPurchaseWei, setInitialPurchaseWei] = useState<bigint>(0n);

  // 4️⃣ Fetch coins whenever `category` changes
  useEffect(() => {
    setLoading(true);
    // Determine which SDK explore query to run
    let fetcher: Promise<any[]>;
    switch (category) {
      case "Top Gainers":
        fetcher = getCoinsTopGainers({ count: 10 })                  // :contentReference[oaicite:10]{index=10}
          .then(r => r.data.exploreList.edges.map(e => e.node));
        break;
      case "Top Volume":
        fetcher = getCoinsTopVolume24h({ count: 10 })                // :contentReference[oaicite:11]{index=11}
          .then(r => r.data.exploreList.edges.map(e => e.node));
        break;
      case "Most Valuable":
        fetcher = getCoinsMostValuable({ count: 10 })                // :contentReference[oaicite:12]{index=12}
          .then(r => r.data.exploreList.edges.map(e => e.node));
        break;
      case "New Coins":
        fetcher = getCoinsNew({ count: 10 })                         // :contentReference[oaicite:13]{index=13}
          .then(r => r.data.exploreList.edges.map(e => e.node));
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
      payoutRecipient: payoutRecipient as `0x${string}`,  // must be a valid Ethereum address :contentReference[oaicite:14]{index=14}
      initialPurchaseWei,
    };

    try {
      const { hash, address: coinAddress } = await createCoin(
        args,
        walletClient,
        publicClient
      );                                                         // :contentReference[oaicite:15]{index=15}
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
          type="number"
          placeholder="Initial Purchase (Wei)"
          value={initialPurchaseWei.toString()}
          onChange={e => setInitialPurchaseWei(BigInt(e.target.value))}
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
// :contentReference[oaicite:16]{index=16}