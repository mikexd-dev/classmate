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
import { set } from "zod";
// import courseContractAbi as abi from "../../modules/contract/CourseABI.json";
type Props = {};

const ProgressUpdate = ({
  unit,
  chapter,
  course,
  courseId,
  courseTokenId,
  profileTokenId,
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

  const [isMinting, setIsMinting] = useState(true);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();

  courseNFTContract?.on("NFTMinted", (from, to, amount, event) => {
    console.log(amount, "event");
    // setIsMinting(false);
    setCompleted(true);
    toast({
      title: "Success",
      description: "Course NFT Minted",
    });
  });

  const [progress, setProgress] = useState(0);
  const router = useRouter();

  function getTotalChapters(course: any): number {
    let totalChapters = 0;
    for (const unit of course.units) {
      totalChapters += unit.chapters.length;
    }
    return totalChapters;
  }

  function getCurrentChapters(course: any, unit: any, chapter: any): number {
    console.log(unit, chapter);
    let totalChapters = 0;
    for (let i = 0; i <= unit; i++) {
      for (let j = 0; j < course.units[i].chapters.length; j++) {
        totalChapters++;
        if (i === unit && j === chapter) {
          return totalChapters;
        }
      }
    }
    return totalChapters;
  }

  async function progressUpdate() {
    const currentChapters = getCurrentChapters(course, unit, chapter);
    const totalChapters = getTotalChapters(course);
    console.log(currentChapters, totalChapters, "called");
    const progress = (currentChapters / totalChapters) * 100;

    // if progress is 100, then create NFT
    if (progress === 100) {
      setIsMinting(true);
      await connect();
      setTimeout(() => {
        console.log(isConnected, "isConnected1");
      }, 1000);
      console.log(isConnected, "isConnected");
      if (isConnected) {
        const profile = await aiProfileContract!.getIndividualProfile(
          profileTokenId
        );
        const tbaAddress = { ...profile }[2];
        console.log(tbaAddress, "tbaAddress");

        const tx = await courseNFTContract!.mintCourse(
          tbaAddress,
          courseTokenId
        );

        const response = await axios.post("/api/progress", {
          completed: progress === 100 ? true : false,
          courseId,
          progress,
        });

        setProgress(progress);
        // setComplete(true);
      } else {
        // stupid retry system
        await connect();
        console.log(isConnected, "isConnected 2");
        const profile = await aiProfileContract!.getIndividualProfile(
          profileTokenId
        );
        const tbaAddress = { ...profile }[2];
        console.log(tbaAddress, "tbaAddress");

        const tx = await courseNFTContract!.mintCourse(
          tbaAddress,
          courseTokenId
        );

        const response = await axios.post("/api/progress", {
          completed: progress === 100 ? true : false,
          courseId,
          progress,
        });

        setProgress(progress);
        setCompleted(true);
      }
    } else {
      const response = await axios.post("/api/progress", {
        completed: progress === 100 ? true : false,
        courseId,
        progress,
      });

      setProgress(progress);
      setCompleted(true);
      console.log(response.data, "updated");
    }
  }

  useEffect(() => {
    // check if progress fulfilled
    async function checkProgress() {
      const response = await axios.get(`/api/progress?courseid=${courseId}`);
      const currentChapters = getCurrentChapters(course, unit, chapter);
      const totalChapters = getTotalChapters(course);

      const progress: any = (currentChapters / totalChapters) * 100;
      console.log(progress, response, "progress");
      setProgress(response?.data?.data?.progress || 0);
      if (response?.data?.data?.progress >= progress.toFixed(0)) {
        setCompleted(true);
      }
    }

    checkProgress();
    setIsMinting(false);
  }, [chapter, course, courseId, unit]);
  return (
    <div className="flex flex-col w-full justify-center items-center py-5">
      <div className="w-full">
        <CourseProgress value={progress} />
      </div>
      {completed && <ConfettiComponent />}
      <Dialog open={isMinting} onOpenChange={setIsMinting}>
        <DialogContent onInteractOutside={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {completed
                ? "Your Course NFT has been successfully minted!"
                : "Minting your course NFT..."}
            </DialogTitle>
            <DialogDescription className="py-3">
              {completed
                ? "Congratulations on completing the course! Well done! You can now view your course NFT under your profile token bound account!"
                : "You will be prompted to use your biometric to approve the minting of the course NFT into your profile."}
            </DialogDescription>
          </DialogHeader>
          {completed ? (
            <div className="flex justify-center items-center">
              <Link href="/credentials">
                <Button>My Credentials</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Please wait a moment while we mint your course NFT...
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* 
      {completed ? (
        <Button
          onClick={() => progressUpdate()}
          className="w-72"
          disabled={completed || progress === 100}
        >
          Completed 🙌
        </Button>
      ) : (
        <Button onClick={() => progressUpdate()} className="w-72">
          I have finished this chapter!
        </Button>
      )} */}
    </div>
  );
};

export default ProgressUpdate;
