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

type Props = {};

const onboardingSteps = {
  "buddy-selection": {
    title: "Learning Buddy",
    description:
      "Select your first learning buddy. He will help you in your learning journey.. the fun way!",
    type: "image",
    content: [
      {
        profleName: "Gang",
        profileImage: "gang.svg",
        profileDescription: "Friendly Soul",
      },
      {
        profleName: "Mike",
        profileImage: "mike.svg",
        profileDescription: "Rebellious Hunk",
      },
      {
        profleName: "Terry",
        profileImage: "terry.svg",
        profileDescription: "Funny Bunny",
      },
    ],
    button: "Next",
  },
  "grade-selection": {
    title: "Grade",
    description: "Which science grade are you in?",
    type: "radio",
    content: ["Primary 3", "Primary 4", "Primary 5", "Primary 6"],
    button: "Next",
  },
  "topics-selection": {
    title: "Topics",
    description:
      "Help us to talior your learning plan by sharing with us on the topics you have learnt in school.",
    type: "checkbox",
    content: [
      "Cycle in plants",
      "Interaction of forces",
      "Energy Forms",
      "Human Digestive System",
      "I have not started on any topics yet",
    ],
    button: "Next",
  },
  quiz: {
    title: "Quiz",
    description:
      "Quiz time! Here’s a short quiz to help us create your personalised learning course!",
    subDescription:
      "They are 10 short questions that will take you less than 5 minutes to complete them. It will earn you coins to redeem other learning buddies too!",
    type: "landing",
    content: [], // to be generated
    button: "I'm Ready",
    points: 20,
  },
  "course-generation": {
    title: "Loading...",
    description: "Generating your learning plan...",
    type: "generating",
    content: [], // to be generated
    button: "Let's Go!",
  },
};

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
      <div className="rounded-3xl bg-violet-700 w-[652px] h-[640px] shadow-md">
        <div className="w-full h-full rounded-t-3xl backdrop-brightness-75">
          <div className="text-white font-oi text-4xl font-normal p-6">
            Learning Buddy
          </div>
        </div>
        <div className="rounded-3xl bg-white absolute top-[23%] w-[652px] h-[575px] shadow-xl p-8 flex flex-col justify-between">
          <div>
            <div className="font-semibold text-3xl pb-2">
              {!isMinting &&
                !isMintingComplete &&
                "Select your first learning buddy"}
              {isMinting &&
                !isMintingComplete &&
                "Minting your learning buddy..."}
              {!isMinting && isMintingComplete && "Your buddy has been minted!"}
            </div>
            {!isMinting && !isMintingComplete && (
              <div className="flex flex-row  gap-x-2 pt-7">
                <div className="flex flex-col justify-center items-center">
                  <div
                    className={cn(
                      "border-4 border-transparent p-1 hover:border-spacing-2 hover:border-purple-600 hover:border-4  hover:rounded-3xl hover:ring-offset-2 hover:p-1 cursor-pointer",
                      {
                        "border-purple-600 border-4 rounded-3xl p-1":
                          profile === 0,
                      }
                    )}
                    onClick={() => setProfile(0)}
                  >
                    <Player
                      autoplay
                      loop
                      src="https://lottie.host/b2d860fc-aea7-41be-a186-71193e6688d1/jYHsj0muJA.json"
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
                    <div className="text-2xl font-semibold">Gang</div>
                    <div className="text-xl font-normal">Friendly Soul</div>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div
                    className={cn(
                      "border-4 border-transparent hover:border-spacing-2 p-1 hover:border-purple-600 hover:border-4  hover:rounded-3xl hover:ring-offset-2 hover:p-1 cursor-pointer",
                      {
                        "border-purple-600 border-4 rounded-3xl p-1":
                          profile === 1,
                      }
                    )}
                    onClick={() => setProfile(1)}
                  >
                    <Player
                      autoplay
                      loop
                      src="https://lottie.host/b2d860fc-aea7-41be-a186-71193e6688d1/jYHsj0muJA.json"
                      style={{
                        height: "180px",
                        width: "180px",
                        borderRadius: "28px",
                        border: "3px solid black",
                      }}
                      className="hover:bg-sky-700"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center pt-3">
                    <div className="text-2xl font-semibold">Mike</div>
                    <div className="text-xl font-normal">Rebellious Hunk</div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <div
                    className={cn(
                      "border-4 border-transparent p-1 hover:border-spacing-2 hover:border-purple-600 hover:border-4  hover:rounded-3xl hover:ring-offset-2 hover:p-1 cursor-pointer",
                      {
                        "border-purple-600 border-4 rounded-3xl p-1":
                          profile === 2,
                      }
                    )}
                    onClick={() => setProfile(2)}
                  >
                    <Player
                      autoplay
                      loop
                      src="https://lottie.host/b2d860fc-aea7-41be-a186-71193e6688d1/jYHsj0muJA.json"
                      style={{
                        height: "180px",
                        width: "180px",
                        borderRadius: "28px",
                        border: "3px solid black",
                      }}
                      className="hover:bg-sky-700"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center pt-3">
                    <div className="text-2xl font-semibold">Terry</div>
                    <div className="text-xl font-normal">Funny Bunny</div>
                  </div>
                </div>
              </div>
            )}
            {/* only show selected buddy */}
            {isMinting ||
              (isMintingComplete && (
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
                      src="https://lottie.host/b2d860fc-aea7-41be-a186-71193e6688d1/jYHsj0muJA.json"
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
                    <div className="text-2xl font-semibold">Gang</div>
                    <div className="text-xl font-normal">Friendly Soul</div>
                  </div>
                </div>
              ))}
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
      </div>
    </div>
  );
}
