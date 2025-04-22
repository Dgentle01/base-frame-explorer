
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { InfoIcon } from "lucide-react";

const ZoraAPICredentialsForm = () => {
  const [zoraApiKey, setZoraApiKey] = useState("");
  const [neynarApiKey, setNeynarApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedZoraApiKey = localStorage.getItem("VITE_ZORA_API_KEY");
    const savedNeynarApiKey = localStorage.getItem("VITE_NEYNAR_API_KEY");
    
    if (savedZoraApiKey) setZoraApiKey(savedZoraApiKey);
    if (savedNeynarApiKey) setNeynarApiKey(savedNeynarApiKey);
  }, []);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      localStorage.setItem("VITE_ZORA_API_KEY", zoraApiKey);
      localStorage.setItem("VITE_NEYNAR_API_KEY", neynarApiKey);

      toast({
        title: "API credentials saved",
        description: "Your API credentials have been saved. The page will reload to apply changes.",
      });

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
        <CardTitle>Protocol API Credentials</CardTitle>
        <CardDescription>
          Enter API keys for Zora and Neynar to enable full functionality.
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
            <p className="text-xs text-gray-500 flex items-start gap-1">
              <InfoIcon className="h-4 w-4 mt-0.5" />
              Get your Zora API key from the Zora Developer Portal
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="neynar-api-key">Neynar API Key</Label>
            <Input
              id="neynar-api-key"
              type="password"
              placeholder="Enter your Neynar API key"
              value={neynarApiKey}
              onChange={(e) => setNeynarApiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500 flex items-start gap-1">
              <InfoIcon className="h-4 w-4 mt-0.5" />
              Get your Neynar API key for Farcaster-related features
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Credentials"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-xs text-gray-500">
          Your API keys will be stored securely in browser localStorage.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ZoraAPICredentialsForm;
