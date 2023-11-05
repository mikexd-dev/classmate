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
import profileContractAbi from "../../contract/ProfileABI.json";
import courseContractAbi from "../../contract/CourseABI.json";
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
    "0x02faade50682498bf0bc7c804919e2b21de54bec";
  const COURSE_NFT_CONTRACT_ADDRESS =
    "0x29c7b38e5c2e530ca6d9b4e21b632c38a55bdc03";

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
      console.log(instance);
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
      console.log(instanceProvider, "instanceProvider");

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

      console.log(profileContract, "profileContract");

      setCounterContract(contract);
      setAIProfileContract(profileContract);
      setCourseNFTContract(courseContract);

      setIsConnected(true);
      setWallet(instance as any);
      setProvider(instanceProvider as any);
      return { profileContract, courseContract };
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
