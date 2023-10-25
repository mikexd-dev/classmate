"use client";
import { ComethProvider, ComethWallet } from "@cometh/connect-sdk";
import { ethers } from "ethers";
import { SessionProvider } from "next-auth/react";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export const WalletContext = createContext<{
  wallet: ComethWallet | null;
  setWallet: Dispatch<SetStateAction<ComethWallet | null>>;
  provider: ComethProvider | null;
  setProvider: Dispatch<SetStateAction<ComethProvider | null>>;
  counterContract: ethers.Contract | null;
  setCounterContract: Dispatch<SetStateAction<any | null>>;
  aiProfileContract: ethers.Contract | null;
  setAIProfileContract: Dispatch<SetStateAction<any | null>>;
  courseNFTContract: ethers.Contract | null;
  setCourseNFTContract: Dispatch<SetStateAction<any | null>>;
}>({
  wallet: null,
  setWallet: () => {},
  provider: null,
  setProvider: () => {},
  counterContract: null,
  setCounterContract: () => {},
  aiProfileContract: null,
  setAIProfileContract: () => {},
  courseNFTContract: null,
  setCourseNFTContract: () => {},
});

export function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [wallet, setWallet] = useState<ComethWallet | null>(null);
  const [provider, setProvider] = useState<ComethProvider | null>(null);
  const [counterContract, setCounterContract] =
    useState<ethers.Contract | null>(null);
  const [aiProfileContract, setAIProfileContract] =
    useState<ethers.Contract | null>(null);
  const [courseNFTContract, setCourseNFTContract] =
    useState<ethers.Contract | null>(null);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        setWallet,
        provider,
        setProvider,
        counterContract,
        setCounterContract,
        aiProfileContract,
        setAIProfileContract,
        courseNFTContract,
        setCourseNFTContract,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
