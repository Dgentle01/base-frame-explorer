
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { WalletProvider } from "@/context/WalletContext";
import ApiCredentials from "./pages/ApiCredentials";
<<<<<<< HEAD
import CreateCoinPage from "./components/CoinManager";
=======
import CoinsPage from "./pages/Coins";
import CoinDetailsPage from "./pages/CoinDetails";
>>>>>>> 2c986637edff5b4dc0c9c782a19498b43d8a8ab6

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
<<<<<<< HEAD
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <WalletProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/api-credentials" element={<ApiCredentials />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            <Route path="/create-coin" element={<CreateCoinPage />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </TooltipProvider>
=======
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <WalletProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/coins" element={<CoinsPage />} />
              <Route path="/coins/:address" element={<CoinDetailsPage />} />
              <Route path="/api-credentials" element={<ApiCredentials />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </WalletProvider>
      </TooltipProvider>
    </ThemeProvider>
>>>>>>> 2c986637edff5b4dc0c9c782a19498b43d8a8ab6
  </QueryClientProvider>
);

export default App;
