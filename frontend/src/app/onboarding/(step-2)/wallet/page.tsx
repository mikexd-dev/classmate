"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ConnectWallet from "@/components/ConnectWallet";
import { useWalletAuth } from "@/modules/wallet/hooks/useWalletAuth";
import { useRouter } from "next/navigation";

type Props = {};

export default function Page(props: Props) {
  const { isConnecting, isConnected, connect, connectionError, wallet } =
    useWalletAuth();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/onboarding/buddy");
    }
  }, [isConnected]);

  return (
    <div
      className="min-h-screen flex justify-center items-center  "
      style={{
        backgroundImage: "url('/background-purple.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="rounded-3xl bg-violet-700 w-[652px] h-[640px] shadow-md">
        <div className="w-full h-full rounded-t-3xl backdrop-brightness-75">
          <div className="text-white font-oi text-4xl font-normal p-6 py-8">
            Welcome
          </div>
        </div>
        <div className="rounded-3xl bg-white absolute top-[25%] w-[652px] h-[575px] shadow-xl p-8 flex flex-col items-end justify-between">
          <div>
            <div className="font-semibold text-3xl pb-2">
              Your own Web3 Wallet
            </div>
            <div className="text-xl">
              Get your very own web3 wallet to house your learning buddies. You
              can easily access it using fingerprint or Face ID.
            </div>
            <div className="flex flex-row justify-center items-center ">
              <Image
                src="../wallet.svg"
                height={200}
                width={240}
                alt={"buddy"}
                className="pt-7"
              />
            </div>
          </div>
          <div className="flex flex-row items-between justify-between w-full">
            <Link href={"/onboarding/learn"}>
              <Button
                className="p-8 px-10 rounded-full text-xl mr-5"
                variant={"secondary"}
              >
                <ChevronLeft className="mr-2 w-6 h-6" strokeWidth={3} />
                Previous
              </Button>
            </Link>

            <ConnectWallet
              isConnected={isConnected}
              isConnecting={isConnecting}
              connect={connect}
              connectionError={connectionError}
              wallet={wallet!}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
