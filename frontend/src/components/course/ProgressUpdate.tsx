"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import router from "next/router";
import input from "postcss/lib/input";
import { useMutation } from "wagmi";
import { toast, useToast } from "../ui/use-toast";
import { CourseProgress } from "./CourseProgress";
import { useWalletAuth } from "@/modules/wallet/hooks/useWalletAuth";
import ConfettiComponent from "../Confetti";
import { ComethProvider } from "@cometh/connect-sdk";
import { ethers } from "ethers";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CoinSVG from "../../../public/coin.svg";
import { getCsrfToken, useSession } from "next-auth/react";
import { Player } from "@lottiefiles/react-lottie-player";
// import courseContractAbi as abi from "../../modules/contract/CourseABI.json";
type Props = {};

const ProgressUpdate = ({
  unit,
  chapter,
  course,
  courseId,
  courseTokenId,
  profileTokenId,
  completed,
  setCompleted,
  progress,
  setProgress,
  setToken,
}: any) => {
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

  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  // const [completed, setCompleted] = useState(false);
  // const [progress, setProgress] = useState(0);
  const [throwConfetti, setThrowConfetti] = useState(false);
  const { toast } = useToast();
  const { data: session, status } = useSession();

  courseNFTContract?.on("NFTMinted", (from, to, amount, event) => {
    // setIsMinting(false);
    setIsMinted(true);
    toast({
      title: "Success",
      description: "Course NFT Minted",
    });

    setProgress(100);
    setCompleted(true);
    setThrowConfetti(true);
  });

  const router = useRouter();

  function getTotalChapters(course: any): number {
    let totalChapters = 0;
    for (const unit of course.units) {
      totalChapters += unit.chapters.length;
    }
    return totalChapters;
  }

  function getCurrentChapters(course: any, unit: any, chapter: any): number {
    if (unit === 0) {
      return chapter + 1 + unit;
    } else if (unit === 1) {
      return chapter + 4 + unit;
    } else {
      return chapter + 7 + unit;
    }
  }

  async function progressUpdate() {
    const currentChapters = getCurrentChapters(course, unit, chapter);

    const progress = (currentChapters / 12) * 100;

    const response = await axios.put("/api/users/token", {
      token: session?.user?.token! + 50,
    });

    const data = await axios.post(`/api/auth/session`, {
      csrfToken: await getCsrfToken(),
      data: response.data.data,
    });

    setToken(session?.user?.token! + 50);

    // if progress is 100, then create NFT
    if (progress === 100) {
      setIsMinting(true);
      setTimeout(() => {
        console.log(isConnected, "isConnected1");
      }, 1000);

      const { profileContract, courseContract }: any = await connect();
      const profile = await profileContract!.getIndividualProfile(
        profileTokenId
      );
      const tbaAddress = { ...profile }[2];
      const tx = await courseContract!.mintCourse(tbaAddress, courseTokenId);

      const response = await axios.post("/api/progress", {
        completed: progress === 100 ? true : false,
        courseId,
        progress,
      });
    } else {
      const response = await axios.post("/api/progress", {
        completed: progress === 100 ? true : false,
        courseId,
        progress,
      });

      setProgress(progress);
      setCompleted(true);
      setThrowConfetti(true);
    }
  }

  useEffect(() => {
    // check if progress fulfilled
    async function checkProgress() {
      const response = await axios.get(`/api/progress?courseid=${courseId}`);
      const currentChapters = getCurrentChapters(course, unit, chapter);
      // const totalChapters = getTotalChapters(course);

      const progress: any = (currentChapters / 12) * 100;
      setProgress(response?.data?.data?.progress || 0);
      if (response?.data?.data?.progress >= progress.toFixed(0)) {
        setCompleted(true);
      }
    }

    checkProgress();
    // setIsMinting(false);
  }, [chapter, course, courseId, unit]);
  return (
    <div className="flex flex-col w-full justify-center items-center py-5">
      <div className="w-full">
        <CourseProgress value={progress} />
      </div>
      {throwConfetti && <ConfettiComponent />}
      <Dialog open={isMinting} onOpenChange={setIsMinting}>
        <DialogContent onInteractOutside={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {isMinted
                ? "Your Course NFT has been successfully minted!"
                : "Minting your course NFT..."}
            </DialogTitle>
            <DialogDescription className="py-3">
              {isMinted
                ? "Congratulations on completing the course! Well done! You can now view your course NFT under your profile token bound account!"
                : "You will be prompted to use your biometric to approve the minting of the course NFT into your profile."}
            </DialogDescription>
          </DialogHeader>
          {isMinted ? (
            <div>
              <Player
                autoplay
                loop
                src="https://lottie.host/04d11dc8-3762-4aea-ab7b-322404cf8ec1/YOQ53KnAda.json"
                style={{
                  height: "300px",
                  width: "300px",
                  // borderRadius: "28px",
                  // border: "3px solid black",
                }}
              />
              <div className="flex justify-center items-center ">
                <Link href="/credentials">
                  <Button className="rounded-3xl">Go to My Profile</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <Player
                autoplay
                loop
                src="https://lottie.host/0a34a2ae-759c-45fd-a975-e69c50404461/U6jSLu1A2r.json"
                style={{
                  height: "120px",
                  width: "120px",
                  borderRadius: "28px",
                  // border: "3px solid black",
                }}
              />
              <Player
                autoplay
                loop
                src="https://lottie.host/aea0f286-6d85-49bc-af0e-d1fbf6fee296/CKjsHErOf4.json"
                style={{
                  height: "20px",
                  width: "120px",
                  paddingTop: "2px",
                }}
              />
              <div className="flex items-center justify-center pt-2">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Please wait a moment while we mint your course NFT...
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-10">
        {completed ? (
          <Button
            onClick={() => progressUpdate()}
            className="w-68 px-6 rounded-3xl bg-purple-600 py-6 flex flex-row gap-x-2"
            disabled={completed || progress === 100}
          >
            <div> Completed 🙌</div>
            {/* <div className="pl-2 bg-purple-800 p-2 rounded-2xl flex flex-row items-center justify-center gap-x-1 px-2 font-2xs">
              50
              <Image src={CoinSVG} height={20} width={20} alt={"buddy"} />
            </div> */}
          </Button>
        ) : (
          <Button
            onClick={() => progressUpdate()}
            className="w-68 px-6 rounded-3xl bg-purple-600 py-6 flex flex-row gap-x-2"
          >
            <div> Lesson Complete</div>
            <div className="pl-2 bg-purple-800 p-2 rounded-2xl flex flex-row items-center justify-center gap-x-1 px-2 font-2xs">
              50
              <Image src={CoinSVG} height={20} width={20} alt={"buddy"} />
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProgressUpdate;
