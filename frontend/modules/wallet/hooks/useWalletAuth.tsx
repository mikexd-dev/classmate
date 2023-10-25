"use client";

import {
  ComethProvider,
  ComethWallet,
  ConnectAdaptor,
  SupportedNetworks,
} from "@cometh/connect-sdk";
import { useState } from "react";
import { useWalletContext } from "./useWalletContext";
import { ethers } from "ethers";
import countContractAbi from "../../contract/counterABI.json";
import profileContractAbi from "../../contract/profileABI.json";
import courseContractAbi from "../../contract/courseABI.json";
import { prisma } from "@/lib/db";
import { useSession } from "next-auth/react";
import { set } from "zod";

export function useWalletAuth() {
  const {
    setWallet,
    setProvider,
    provider,
    wallet,
    counterContract,
    setCounterContract,
    aiProfileContract,
    setAIProfileContract,
    courseNFTContract,
    setCourseNFTContract,
  } = useWalletContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [connectionError, setConnectionError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_COMETH_API_KEY!;
  const COUNTER_CONTRACT_ADDRESS = "0x3633A1bE570fBD902D10aC6ADd65BB11FC914624";
  const AI_PROFILE_CONTRACT_ADDRESS =
    "0x22c9d6fa7e72f751f8af7f81a333f068c9d9a0ef";
  const COURSE_NFT_CONTRACT_ADDRESS =
    "0xc8049e79740b6de70b36a53ab7b6ef74f0394f38";

  const { data: session, status, update } = useSession();

  function displayError(message: string) {
    setConnectionError(message);
  }

  async function connect() {
    setIsConnecting(true);
    try {
      const walletAdaptor = new ConnectAdaptor({
        chainId: SupportedNetworks.MUMBAI,
        apiKey,
      });

      const instance = new ComethWallet({
        authAdapter: walletAdaptor,
        apiKey,
      });

      let localStorageAddress = window.localStorage.getItem("walletAddress");

      if (localStorageAddress) {
        await instance.connect(localStorageAddress);
      } else {
        // create new wallet address
        await instance.connect();
        localStorageAddress = await instance.getAddress();
        window.localStorage.setItem("walletAddress", localStorageAddress);
      }

      // update user in db with walletAddress
      console.log("updaing user", localStorageAddress);
      const data = await fetch(`/api/users?id=${session?.user?.id}`, {
        method: "POST",
        body: JSON.stringify({ walletAddress: localStorageAddress }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const user = await data.json();
      update({ user: user.data });
      window.localStorage.setItem("user", JSON.stringify(user.data));

      const instanceProvider = new ComethProvider(instance);

      const contract = new ethers.Contract(
        COUNTER_CONTRACT_ADDRESS,
        countContractAbi,
        instanceProvider.getSigner()
      );

      const profileContract = new ethers.Contract(
        AI_PROFILE_CONTRACT_ADDRESS,
        profileContractAbi,
        instanceProvider.getSigner()
      );

      const courseContract = new ethers.Contract(
        COURSE_NFT_CONTRACT_ADDRESS,
        courseContractAbi,
        instanceProvider.getSigner()
      );

      console.log(courseNFTContract, "courseNFTContract");

      setCounterContract(contract);
      setAIProfileContract(profileContract);
      setCourseNFTContract(courseContract);

      setIsConnected(true);
      setWallet(instance as any);
      setProvider(instanceProvider as any);
    } catch (e) {
      displayError((e as Error).message);
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnect() {
    if (wallet) {
      try {
        await wallet!.logout();
        setIsConnected(false);
        setWallet(null);
        setProvider(null);
        setCounterContract(null);
      } catch (e) {
        displayError((e as Error).message);
      }
    }
  }
  return {
    wallet,
    counterContract,
    aiProfileContract,
    courseNFTContract,
    provider,
    connect,
    disconnect,
    isConnected,
    isConnecting,
    connectionError,
    setConnectionError,
  };
}
