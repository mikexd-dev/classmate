"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { WalletProvider } from "@/modules/wallet/services/context";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

export function Providers({ children, ...props }: ThemeProviderProps) {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [polygonMumbai],
    [publicProvider()]
  );

  const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
  });

  return (
    <QueryClientProvider client={new QueryClient()}>
      <WagmiConfig config={config}>
        <WalletProvider>
          <SessionProvider>
            <NextThemesProvider {...props} defaultTheme="light">
              {children}
            </NextThemesProvider>
          </SessionProvider>
        </WalletProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
