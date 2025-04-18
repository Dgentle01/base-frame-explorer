
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { InfoIcon, Loader2 } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { toast } from "@/hooks/use-toast";
import { deployCoin } from "@/services/coinService";
import { parseEther } from 'viem';

const createCoinSchema = z.object({
  name: z.string().min(1, "Name is required"),
  symbol: z.string().min(1, "Symbol is required")
    .max(8, "Symbol should be 8 characters or less")
    .refine(val => /^[A-Z0-9]+$/.test(val), {
      message: "Symbol should only contain uppercase letters and numbers",
    }),
  description: z.string().min(1, "Description is required"),
  uri: z.string().min(1, "Metadata URI is required")
    .refine(val => val.startsWith("ipfs://") || val.startsWith("https://"), {
      message: "URI should start with ipfs:// or https://",
    }),
  initialPurchaseETH: z.string()
    .refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Initial purchase amount must be a number",
    }),
});

interface CreateCoinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCoinDialog({ open, onOpenChange }: CreateCoinDialogProps) {
  const { address, isConnected } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  
  const form = useForm<z.infer<typeof createCoinSchema>>({
    resolver: zodResolver(createCoinSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      uri: "",
      initialPurchaseETH: "0.01",
    },
  });

  async function onSubmit(values: z.infer<typeof createCoinSchema>) {
    if (!address || !isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a coin",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      // Prepare metadata if URI is not provided with proper format
      let metadataUri = values.uri;
      
      // If it doesn't start with ipfs://, assume we need to create metadata
      if (!metadataUri.startsWith("ipfs://")) {
        // This is a placeholder - in production you'd want to upload to IPFS
        // and get back an IPFS URI
        toast({
          title: "Warning",
          description: "For production use, you should upload metadata to IPFS first",
          // Changed from 'warning' to 'destructive' to match allowed variants
          variant: "destructive",
        });
      }

      const result = await deployCoin(
        {
          name: values.name,
          symbol: values.symbol,
          uri: metadataUri,
          payoutRecipient: address as `0x${string}`,
          initialPurchaseWei: parseEther(values.initialPurchaseETH),
        },
        address as `0x${string}`
      );

      toast({
        title: "Coin created successfully",
        description: `Transaction hash: ${result.hash}`,
      });
      
      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
      
    } catch (error) {
      console.error("Error creating coin:", error);
      toast({
        title: "Error creating coin",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Coin</DialogTitle>
          <DialogDescription>
            Create your own token on the Zora protocol with automatic liquidity.
          </DialogDescription>
        </DialogHeader>

        {!isConnected ? (
          <div className="py-6">
            <p className="text-center text-muted-foreground">Please connect your wallet to create a coin</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coin Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Coin" {...field} />
                    </FormControl>
                    <FormDescription>
                      The full name of your coin (e.g., "Rocket Launcher")
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="COIN" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                    </FormControl>
                    <FormDescription>
                      Trading symbol (e.g., "RCKT"). Uppercase letters and numbers only.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your coin..." {...field} />
                    </FormControl>
                    <FormDescription>
                      A short description of your coin and its purpose
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="uri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metadata URI</FormLabel>
                    <FormControl>
                      <Input placeholder="ipfs://..." {...field} />
                    </FormControl>
                    <FormDescription className="flex items-start gap-1">
                      <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        IPFS URI pointing to your coin's metadata JSON. Should include name, description, 
                        and image. Format: <code className="text-xs">ipfs://bafyb...</code>
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="initialPurchaseETH"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Purchase (ETH)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Amount of ETH to provide as initial liquidity. This will be sent with your transaction.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Creating a coin requires a transaction on the Base network and gas fees. 
                    Make sure your wallet is connected to Base and has sufficient ETH.
                  </span>
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Coin...
                  </>
                ) : "Create Coin"}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
