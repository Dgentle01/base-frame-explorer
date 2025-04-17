// src/components/CreateCoinButton.tsx
import React from "react";
import { createCoinCall } from "@zoralabs/coins-sdk";  // Lower‑level call config :contentReference[oaicite:24]{index=24}
import { useSimulateContract, useWriteContract } from "wagmi";

const coinParams = {
  name: "My Awesome Coin",
  symbol: "MAC",
  uri: "ipfs://<METADATA_URI>",
  payoutRecipient: "0xYOUR_ADDRESS" as any,
};

export function CreateCoinButton() {
  // Prepare the transaction config
  const { data: config } = useSimulateContract(createCoinCall(coinParams));
  // Hook to send the transaction
  const { write, status } = useWriteContract(config);

  return (
    <button onClick={() => write?.()} disabled={!write}>
      {status === "pending" ? "Minting…" : "Mint Coin"}
    </button>
  );
}
