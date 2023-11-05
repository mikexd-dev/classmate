"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import ConnectWallet from "@/components/ConnectWallet";
import { useWalletAuth } from "@/modules/wallet/hooks/useWalletAuth";
import { useRouter } from "next/navigation";
import { Player } from "@lottiefiles/react-lottie-player";
import { cn } from "@/lib";
import axios from "axios";
import ConfettiComponent from "@/components/Confetti";
import { useToast } from "@/components/ui/use-toast";
import { AnimatePresence, motion } from "framer-motion";

const profiles = [
  {
    name: "Gang",
    image:
      "https://lottie.host/b2d860fc-aea7-41be-a186-71193e6688d1/jYHsj0muJA.json",
    description: "Friendly Soul",
  },
  {
    name: "Mike",
    image:
      "https://lottie.host/b2d860fc-aea7-41be-a186-71193e6688d1/jYHsj0muJA.json",
    description: "Rebellious Hunk",
  },
  {
    name: "Terry",
    image:
      "https://lottie.host/b2d860fc-aea7-41be-a186-71193e6688d1/jYHsj0muJA.json",
    description: "Funny Bunny",
  },
];

type Props = {};

export default function Page(props: Props) {
  const {
    isConnecting,
    isConnected,
    connect,
    connectionError,
    wallet,
    aiProfileContract,
  } = useWalletAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(-1);
  const [isMinting, setIsMinting] = useState(false);
  const [isMintingComplete, setCompleteMinting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isConnected) {
      router.push("/onboarding/buddy");
    }
  }, [isConnected, router]);

  aiProfileContract?.on("NFTMinted", async (from, to, amount, event) => {
    const tokenProfileId = Number({ ...amount?.args }[1]);
    const response = await axios.put("/api/users", {
      tokenProfileId,
    });

    toast({
      title: "Success",
      description: "Profile NFT Minted!",
    });
    setIsMinting(false);
    setCompleteMinting(true);
  });

  return (
    <div
      className="min-h-screen flex justify-center items-center  "
      style={{
        backgroundImage: "url('/background-purple.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {isMintingComplete && <ConfettiComponent />}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 1,
              ease: [0.5, 0.71, 1, 1.5],
              delayChildren: 0.5,
              staggerChildren: 0.5,
            },
          }}
          className="rounded-3xl bg-violet-700 w-[652px] h-[640px] shadow-md"
        >
          <div className="w-full h-full rounded-t-3xl backdrop-brightness-75">
            <div className="text-white font-oi text-4xl font-normal p-6 py-8">
              Learning Buddy
            </div>
          </div>
          <div className="rounded-3xl bg-white absolute top-[27%] w-[652px] h-[575px] shadow-xl p-8 flex flex-col justify-between">
            <div>
              <div className="font-semibold text-3xl pb-2">
                {!isMinting &&
                  !isMintingComplete &&
                  "Select your first learning buddy"}
                {isMinting &&
                  !isMintingComplete &&
                  "Minting your learning buddy..."}
                {!isMinting &&
                  isMintingComplete &&
                  "Your buddy has been minted!"}
              </div>
              {!isMinting && !isMintingComplete && (
                <div className="flex flex-row  gap-x-2 pt-7">
                  {profiles.map((singleProfile, index) => (
                    <div
                      key={index}
                      className="flex flex-col justify-center items-center"
                    >
                      <div
                        className={cn(
                          "border-4 border-transparent p-1 hover:border-spacing-2 hover:border-purple-600 hover:border-4  hover:rounded-3xl hover:ring-offset-2 hover:p-1 cursor-pointer",
                          {
                            "border-purple-600 border-4 rounded-3xl p-1":
                              profile === index,
                          }
                        )}
                        onClick={() => setProfile(index)}
                      >
                        <Player
                          autoplay
                          loop
                          src={singleProfile.image}
                          style={{
                            height: "180px",
                            width: "180px",
                            borderRadius: "24px",
                            border: "3px solid black",
                          }}
                          className="hover:bg-sky-700"
                        />
                      </div>
                      <div className="flex flex-col items-center justify-center pt-3">
                        <div className="text-2xl font-semibold">
                          {singleProfile.name}
                        </div>
                        <div className="text-xl font-normal">
                          {singleProfile.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* only show selected buddy */}
              {(isMinting || isMintingComplete) && (
                <div className="flex flex-col justify-center items-center pt-7">
                  <div
                    className={cn(
                      "border-4 border-transparent p-1 hover:border-spacing-2 hover:border-purple-600 hover:border-4  hover:rounded-3xl hover:ring-offset-2 hover:p-1 cursor-pointer",
                      {
                        "border-purple-600 border-4 rounded-3xl p-1":
                          profile === profile,
                      }
                    )}
                  >
                    <Player
                      autoplay
                      loop
                      src={profiles[profile].image}
                      style={{
                        height: "180px",
                        width: "180px",
                        borderRadius: "24px",
                        border: "3px solid black",
                      }}
                      className="hover:bg-sky-700"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center pt-3">
                    <div className="text-2xl font-semibold">
                      {profiles[profile].name}
                    </div>
                    <div className="text-xl font-normal">
                      {profiles[profile].description}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-row items-between justify-between w-full">
              <Link href={"/onboarding/wallet"}>
                <Button
                  className="p-8 px-10 rounded-full text-xl mr-5"
                  variant={"secondary"}
                >
                  <ChevronLeft className="mr-2 w-6 h-6" strokeWidth={3} />
                  Previous
                </Button>
              </Link>
              <Button
                onClick={async (e) => {
                  e.preventDefault();
                  if (isMintingComplete) {
                    // move on
                    router.push("/onboarding/grade");
                  } else {
                    setIsMinting(true);
                    const { profileContract, courseContract }: any =
                      await connect();
                    const tx = await profileContract!.createProfile(profile);
                  }
                }}
                disabled={isMinting || profile === -1}
                className="p-8 px-10 rounded-full text-xl mr-5 bg-purple-600 drop-shadow-md cursor-pointer"
              >
                {!isMinting && !isMintingComplete && "Mint My Profile"}
                {isMinting && !isMintingComplete && "Minting..."}
                {!isMinting && isMintingComplete && "Next"}
                {isMinting && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
