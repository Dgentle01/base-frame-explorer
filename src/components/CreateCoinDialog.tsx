
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useWallet } from "@/context/WalletContext"
import { toast } from "@/hooks/use-toast"
import { deployCoin } from "@/services/coinService"

const formSchema = z.object({
  name: z.string().min(1).max(50),
  symbol: z.string().min(1).max(10),
  uri: z.string().url(),
  initialPurchaseWei: z.string().regex(/^\d+$/).transform(val => BigInt(val)),
})

interface CreateCoinDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateCoinDialog({ open, onOpenChange }: CreateCoinDialogProps) {
  const { address } = useWallet();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      uri: "",
      initialPurchaseWei: "0",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a coin",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await deployCoin({
        ...values,
        payoutRecipient: address,
      }, address);

      toast({
        title: "Coin created successfully",
        description: `Transaction hash: ${result.hash}`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error creating coin",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Coin</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Coin" {...field} />
                  </FormControl>
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
                    <Input placeholder="MAC" {...field} />
                  </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="initialPurchaseWei"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Purchase (Wei)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Create Coin</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
