"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ExternalLink,
  Info,
  InfoIcon,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { connect } from "http2";
import ConnectWallet from "../ConnectWallet";
import { useWalletAuth } from "@/modules/wallet/hooks/useWalletAuth";
import Confetti from "react-confetti/dist/types/Confetti";
import ConfettiComponent from "../Confetti";
import { toast } from "../ui/use-toast";
import { cn, shortenEthAddress } from "@/lib";
import { Badge } from "../ui/badge";
import { CourseProgress } from "../course/CourseProgress";
import Image from "next/image";
import { useSession } from "next-auth/react";

const profiles = [
  {
    name: "Waiting",
    description:
      "The AIducation Profile NFT serves as a learner's unique on-chain identity and certificate of learning. Each learner who signs up for AIducation gets their own Profile NFT, which displays their name, photo, and learning achievements. The NFT acts as a portable record of the learner's personalized AI courses, skills gained, and completion certificates. The Profile NFT also enables seamless access to the AIducation platform and community. By providing an on-chain identity, the AIducation Profile NFT empowers learners to own and control their learning records and credentials.",
    image:
      "https://aiducation.s3.ap-southeast-1.amazonaws.com/assets/waiting.png",
    attributes: [
      {
        trait_type: "user_type",
        value: "Waiting",
      },
    ],
  },
  {
    name: "Bueno",
    description:
      "The AIducation Profile NFT serves as a learner's unique on-chain identity and certificate of learning. Each learner who signs up for AIducation gets their own Profile NFT, which displays their name, photo, and learning achievements. The NFT acts as a portable record of the learner's personalized AI courses, skills gained, and completion certificates. The Profile NFT also enables seamless access to the AIducation platform and community. By providing an on-chain identity, the AIducation Profile NFT empowers learners to own and control their learning records and credentials.",
    image:
      "https://aiducation.s3.ap-southeast-1.amazonaws.com/assets/bueno.png",
    attributes: [
      {
        trait_type: "user_type",
        value: "Bueno",
      },
    ],
  },
  {
    name: "Growth",
    description:
      "The AIducation Profile NFT serves as a learner's unique on-chain identity and certificate of learning. Each learner who signs up for AIducation gets their own Profile NFT, which displays their name, photo, and learning achievements. The NFT acts as a portable record of the learner's personalized AI courses, skills gained, and completion certificates. The Profile NFT also enables seamless access to the AIducation platform and community. By providing an on-chain identity, the AIducation Profile NFT empowers learners to own and control their learning records and credentials.",
    image:
      "https://aiducation.s3.ap-southeast-1.amazonaws.com/assets/growth.png",
    attributes: [
      {
        trait_type: "user_type",
        value: "Growth",
      },
    ],
  },
  {
    name: "Chill",
    description:
      "The AIducation Profile NFT serves as a learner's unique on-chain identity and certificate of learning. Each learner who signs up for AIducation gets their own Profile NFT, which displays their name, photo, and learning achievements. The NFT acts as a portable record of the learner's personalized AI courses, skills gained, and completion certificates. The Profile NFT also enables seamless access to the AIducation platform and community. By providing an on-chain identity, the AIducation Profile NFT empowers learners to own and control their learning records and credentials.",
    image:
      "https://aiducation.s3.ap-southeast-1.amazonaws.com/assets/puppy.png",
    attributes: [
      {
        trait_type: "user_type",
        value: "Chill",
      },
    ],
  },
];

type Props = {
  open: boolean;
  newUser: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateWalletDialog = ({ open, setOpen, newUser }: Props) => {
  const router = useRouter();
  const {
    isConnecting,
    isConnected,
    connect,
    connectionError,
    wallet,
    counterContract,
    courseNFTContract,
    aiProfileContract,
    provider,
  } = useWalletAuth();

  const [input, setInput] = React.useState("");
  const [onboardingProgress, setOnboardingProgress] = React.useState(0);
  const [onboardingStep, setOnboardingStep] = React.useState(0);
  const [profileSelected, setProfile] = React.useState(0);
  const [isMinting, setIsMinting] = React.useState(false);
  const { data: session, status } = useSession();

  aiProfileContract?.on("NFTMinted", async (from, to, amount, event) => {
    const tokenProfileId = Number({ ...amount?.args }[1]);
    const response = await axios.put("/api/users", {
      tokenProfileId,
    });
    setIsMinting(false);
    setOnboardingProgress(50);
    setOnboardingStep(1);
  });

  const { mutate: createChapters, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/course/chapters", {
        title: input,
      });
      return response.data;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "") {
      window.alert("Please enter a name for your notebook");
      return;
    }
    createChapters(undefined, {
      onSuccess: ({ course_id }) => {
        toast({
          title: "Success",
          description: "Course created",
        });
        router.push(`/create/${course_id}`);
      },

      onError: () => {
        toast({
          title: "Error",
          description: "Error creating course",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onInteractOutside={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {newUser ? "🎊 Welcome to AIducation!" : "Get a Wallet"}
            </DialogTitle>
            <DialogDescription className="py-3">
              {newUser
                ? "We're excited you've joined our community of lifelong learners. First create a profile that best depicts you and let's get started on your first course! Enter a topic you'd like to learn about, sit back and wait for your course to be generated!"
                : "Hi there! When you sign up, we will securely create a crypto wallet just for you. You can easily unlock and access your wallet using your fingerprint or facial recognition. Your wallet and crypto assets will be safe and convenient to use anytime!"}
            </DialogDescription>
          </DialogHeader>

          {newUser ? (
            <form onSubmit={handleSubmit}>
              <div className="w-full flex space-x-5 py-3 border-none bg-secondary items-center justify-center px-3 rounded-md mb-5">
                <InfoIcon className="w-4 h-4 mr-3 text-blue-400 flex-4" />
                <div className="flex-2 text-xs">
                  Here's your wallet address
                  <br />
                  (if you are curious 😋 )
                </div>
                <Badge
                  onClick={() => {
                    window.open(
                      `https://mumbai.polygonscan.com/address/${wallet?.getAddress()}`,
                      "_blank"
                    );
                  }}
                  className="flex flex-row cursor-pointer items-center p-2  flex-1 justify-center items-center"
                >
                  <div>
                    {wallet?.getAddress()
                      ? shortenEthAddress(wallet?.getAddress() as string)
                      : "loading wallet..."}
                  </div>

                  <ExternalLink className="w-4 h-4 ml-2" />
                </Badge>
              </div>

              <div>
                <div className="text-center text-xs font-bold pb-2">
                  Onboarding Step {onboardingStep + 1}:{" "}
                  {onboardingStep === 0
                    ? "Mint your profile!"
                    : "Create a course!"}
                </div>
                <CourseProgress
                  variant={onboardingProgress === 100 ? "success" : "default"}
                  size="sm"
                  value={onboardingProgress}
                />
              </div>
              {onboardingStep === 0 && (
                <div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 py-3">
                    {profiles.map((item, index) => (
                      <div
                        key="index"
                        className={cn(
                          "group hover:shadow-sm transition overflow-hidden border rounded-lg  hover:border-black focus:border-black active:border-black cursor-pointer",
                          {
                            "border-black": profileSelected === index,
                          }
                        )}
                        onClick={() => setProfile(index)}
                      >
                        <div className="relative w-full aspect-square rounded-md overflow-hidden">
                          <Image
                            fill
                            className="object-cover"
                            alt={item.name}
                            src={item.image}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full py-2">
                    {/* <Button
                      onClick={async (e) => {
                        e.preventDefault();
                        setIsMinting(true);
                        const tx = await courseNFTContract!.mint("", 0);
                      }}
                      disabled={isMinting}
                      className="w-full"
                    >
                      {isMinting && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      Next Step
                    </Button> */}

                    <Button
                      onClick={async (e) => {
                        e.preventDefault();
                        setIsMinting(true);
                        const tx = await aiProfileContract!.createProfile(
                          profileSelected
                        );
                      }}
                      disabled={isMinting}
                      className="w-full"
                    >
                      {isMinting && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      Mint My Profile
                    </Button>
                  </div>
                </div>
              )}
              {onboardingStep === 1 && (
                <div>
                  <div className="flex flex-row justify-center items-center space-x-3 py-5">
                    <div className="flex-2 relative">
                      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
                      <Input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        className="w-full md:w-[350px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
                        placeholder="Enter a topic you'd like to learn about"
                      />
                    </div>

                    <Button type="submit" className=" " disabled={isLoading}>
                      {isLoading && (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      )}
                      {isLoading ? "loading..." : "Let's Go!"}
                    </Button>
                  </div>
                  <div className="flex items-center p-2 mt-1 border-none bg-orange-100 text-xs rounded-xl ">
                    <Info className="w-5 mr-3 text-orange-400" />
                    <div className="font-normal">
                      Note: Generation might take a little while & Any errors
                      might be due to daily Youtube API quota
                    </div>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <ConnectWallet
              isConnected={isConnected}
              isConnecting={isConnecting}
              connect={connect}
              connectionError={connectionError}
              wallet={wallet!}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateWalletDialog;
