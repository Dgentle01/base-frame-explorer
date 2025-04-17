// src/services/mintService.ts
import {
    createCoin,
    CreateCoinArgs
  } from "@zoralabs/coins-sdk";               // createCoin function :contentReference[oaicite:20]{index=20}
  import {
    createPublicClient,
    createWalletClient,
    http,
  } from "viem";                             // viem clients :contentReference[oaicite:21]{index=21}
  import { base } from "viem/chains";
  
  const RPC_URL = "https://base.rpc.url";      // Replace with your RPC
  
  const publicClient = createPublicClient({
    chain: base,
    transport: http(RPC_URL),
  });
  const walletClient = createWalletClient({
    chain: base,
    transport: http(RPC_URL),
    account: "0xYOUR_ADDRESS" as any,
  });
  
  // Define your coin parameters
  const coinParams: CreateCoinArgs = {
    name: "My Awesome Coin",
    symbol: "MAC",
    uri: "ipfs://<METADATA_URI>",            // Metadata JSON on IPFS
    payoutRecipient: "0xYOUR_ADDRESS" as any,
    initialPurchaseWei: 0n,
  };
  
  // Function to mint
  export async function mintCoin() {
    const result = await createCoin(coinParams, walletClient, publicClient);
    // result.hash = txn hash, result.address = new coin contract address
    return result;
  }
  