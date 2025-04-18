
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { parseEther, formatEther } from 'viem';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight, TrendingUp, TrendingDown } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { toast } from "@/hooks/use-toast";
import { buyCoin, sellCoin, simulateCoinBuy, simulateCoinSell } from "@/services/coinService";

const buyFormSchema = z.object({
  coinAddress: z.string().startsWith("0x").length(42),
  amountETH: z.string().min(1).refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
});

const sellFormSchema = z.object({
  coinAddress: z.string().startsWith("0x").length(42),
  tokenAmount: z.string().min(1).refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
});

interface CoinTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCoin?: any; // Optional coin to pre-populate
}

export default function CoinTradeDialog({ open, onOpenChange, selectedCoin }: CoinTradeDialogProps) {
  const { address, isConnected } = useWallet();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [isBuying, setIsBuying] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [simulatedBuyOutput, setSimulatedBuyOutput] = useState<bigint | null>(null);
  const [simulatedSellOutput, setSimulatedSellOutput] = useState<bigint | null>(null);
  
  const buyForm = useForm<z.infer<typeof buyFormSchema>>({
    resolver: zodResolver(buyFormSchema),
    defaultValues: {
      coinAddress: selectedCoin?.address || "",
      amountETH: "0.01",
    },
  });

  const sellForm = useForm<z.infer<typeof sellFormSchema>>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      coinAddress: selectedCoin?.address || "",
      tokenAmount: "1",
    },
  });

  // Update form when selected coin changes
  useEffect(() => {
    if (selectedCoin?.address) {
      buyForm.setValue('coinAddress', selectedCoin.address);
      sellForm.setValue('coinAddress', selectedCoin.address);
    }
  }, [selectedCoin, buyForm, sellForm]);

  // Simulate buy when amount changes
  const debouncedSimulateBuy = async (address: string, amount: string) => {
    if (!address || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setSimulatedBuyOutput(null);
      return;
    }
    
    try {
      const result = await simulateCoinBuy(address as `0x${string}`, amount);
      setSimulatedBuyOutput(result.amountOut);
    } catch (error) {
      console.error("Error simulating buy:", error);
      setSimulatedBuyOutput(null);
    }
  };

  // Simulate sell when amount changes
  const debouncedSimulateSell = async (address: string, amount: string) => {
    if (!address || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setSimulatedSellOutput(null);
      return;
    }
    
    try {
      const result = await simulateCoinSell(address as `0x${string}`, amount);
      setSimulatedSellOutput(result.amountOut);
    } catch (error) {
      console.error("Error simulating sell:", error);
      setSimulatedSellOutput(null);
    }
  };

  // Watch for changes to trigger simulations
  useEffect(() => {
    const buySubscription = buyForm.watch((value, { name }) => {
      if (name === 'amountETH' || name === 'coinAddress') {
        debouncedSimulateBuy(value.coinAddress || "", value.amountETH || "0");
      }
    });
    
    const sellSubscription = sellForm.watch((value, { name }) => {
      if (name === 'tokenAmount' || name === 'coinAddress') {
        debouncedSimulateSell(value.coinAddress || "", value.tokenAmount || "0");
      }
    });

    return () => {
      buySubscription.unsubscribe();
      sellSubscription.unsubscribe();
    };
  }, [buyForm, sellForm]);

  async function onBuySubmit(values: z.infer<typeof buyFormSchema>) {
    if (!address || !isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to trade coins",
        variant: "destructive",
      });
      return;
    }

    setIsBuying(true);
    try {
      const result = await buyCoin(
        values.coinAddress as `0x${string}`, 
        values.amountETH, 
        address as `0x${string}`,
        simulatedBuyOutput ? BigInt(Math.floor(Number(simulatedBuyOutput) * 0.95)) : 0n // 5% slippage
      );

      toast({
        title: "Buy order submitted",
        description: `Transaction hash: ${result.hash}`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Buy error:", error);
      toast({
        title: "Error buying coin",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsBuying(false);
    }
  }

  async function onSellSubmit(values: z.infer<typeof sellFormSchema>) {
    if (!address || !isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to trade coins",
        variant: "destructive",
      });
      return;
    }

    setIsSelling(true);
    try {
      const result = await sellCoin(
        values.coinAddress as `0x${string}`, 
        values.tokenAmount, 
        address as `0x${string}`,
        simulatedSellOutput ? BigInt(Math.floor(Number(simulatedSellOutput) * 0.95)) : 0n // 5% slippage
      );

      toast({
        title: "Sell order submitted",
        description: `Transaction hash: ${result.hash}`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Sell error:", error);
      toast({
        title: "Error selling coin",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSelling(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            Trade Coin
          </DialogTitle>
        </DialogHeader>

        {!isConnected ? (
          <div className="py-6">
            <p className="text-center text-muted-foreground">Please connect your wallet to trade coins</p>
          </div>
        ) : (
          <Tabs value={tradeType} onValueChange={(v) => setTradeType(v as 'buy' | 'sell')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Buy
              </TabsTrigger>
              <TabsTrigger value="sell" className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4" />
                Sell
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="mt-4">
              <Form {...buyForm}>
                <form onSubmit={buyForm.handleSubmit(onBuySubmit)} className="space-y-4">
                  <FormField
                    control={buyForm.control}
                    name="coinAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coin Address</FormLabel>
                        <FormControl>
                          <Input placeholder="0x..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={buyForm.control}
                    name="amountETH"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (ETH)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.001" min="0.001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {simulatedBuyOutput !== null && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">You will receive approximately:</p>
                      <p className="text-xl font-bold">{formatEther(simulatedBuyOutput)} Tokens</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isBuying}
                  >
                    {isBuying ? "Processing..." : "Buy Coin"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="sell" className="mt-4">
              <Form {...sellForm}>
                <form onSubmit={sellForm.handleSubmit(onSellSubmit)} className="space-y-4">
                  <FormField
                    control={sellForm.control}
                    name="coinAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coin Address</FormLabel>
                        <FormControl>
                          <Input placeholder="0x..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={sellForm.control}
                    name="tokenAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Amount</FormLabel>
                        <FormControl>
                          <Input type="number" step="1" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {simulatedSellOutput !== null && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">You will receive approximately:</p>
                      <p className="text-xl font-bold">{formatEther(simulatedSellOutput)} ETH</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSelling}
                  >
                    {isSelling ? "Processing..." : "Sell Coin"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
