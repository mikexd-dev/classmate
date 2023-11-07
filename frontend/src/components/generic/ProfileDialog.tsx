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
import { ExternalLink, InfoIcon, Loader2, Plus, Search } from "lucide-react";
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

type Props = {
  open: boolean;
  profileTokenId: number;
  setOpen: (open: boolean) => void;
};

const ProfileDialog = ({ open, setOpen, profileTokenId }: Props) => {
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

  aiProfileContract?.on("NFTMinted", (from, to, amount, event) => {
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
    <div className="w-[600px]">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          // onInteractOutside={(event) => event.preventDefault()}
          className={
            "md:max-w-screen-md lg:max-w-screen-lg overflow-y-scroll max-h-screen"
          }
        >
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription className="py-3">Description</DialogDescription>
          </DialogHeader>

          <div className="w-full">
            <iframe
              width="100%"
              height="600"
              src={`https://iframe-tokenbound.vercel.app/0x22c9d6fa7e72f751f8af7f81a333f068c9d9a0ef/${profileTokenId}/80001`}
              title="YouTube video player"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileDialog;
