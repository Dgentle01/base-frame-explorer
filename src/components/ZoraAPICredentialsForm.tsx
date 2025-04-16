
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const ZoraAPICredentialsForm = () => {
  const [zoraApiKey, setZoraApiKey] = useState("");
  const [farcasterApiKey, setFarcasterApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get saved API keys from localStorage on component mount
  useEffect(() => {
    const savedZoraApiKey = localStorage.getItem("VITE_ZORA_API_KEY");
    const savedFarcasterApiKey = localStorage.getItem("VITE_FARCASTER_API_KEY");
    
    if (savedZoraApiKey) setZoraApiKey(savedZoraApiKey);
    if (savedFarcasterApiKey) setFarcasterApiKey(savedFarcasterApiKey);
  }, []);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Store API keys in localStorage
      localStorage.setItem("VITE_ZORA_API_KEY", zoraApiKey);
      localStorage.setItem("VITE_FARCASTER_API_KEY", farcasterApiKey);

      toast({
        title: "API credentials saved",
        description: "Your API credentials have been saved. The page will reload to apply changes.",
      });

      // Reload the page after a short delay to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error saving API credentials:", error);
      toast({
        title: "Error",
        description: "Failed to save API credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>API Credentials</CardTitle>
        <CardDescription>
          Enter your API credentials for Zora and Farcaster (Neynar) to use real data.
          Leave empty to use mock data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveCredentials} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zora-api-key">Zora API Key</Label>
            <Input
              id="zora-api-key"
              type="password"
              placeholder="Enter your Zora API key"
              value={zoraApiKey}
              onChange={(e) => setZoraApiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Get your Zora API key from{" "}
              <a
                href="https://zora.co/docs/developers/apis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Zora Developer Portal
              </a>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="farcaster-api-key">Farcaster API Key (Neynar)</Label>
            <Input
              id="farcaster-api-key"
              type="password"
              placeholder="Enter your Farcaster (Neynar) API key"
              value={farcasterApiKey}
              onChange={(e) => setFarcasterApiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Get your Farcaster API key from{" "}
              <a
                href="https://neynar.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Neynar
              </a>
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Credentials"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-xs text-gray-500">
          Your API keys will be stored in your browser's localStorage for convenience.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ZoraAPICredentialsForm;
