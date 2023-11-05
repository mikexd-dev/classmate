"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Image from "next/image";
import { Loader2, ArrowRight, ChevronRight } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import router from "next/router";
import { Player } from "@lottiefiles/react-lottie-player";
import { useWindowSize } from "@/lib/useWindowSize";

type Props = {};

const Page = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  if (session?.user) {
    redirect("/onboarding");
  }
  return (
    <div className="">
      {windowWidth >= 1440 && (
        <nav className="fixed inset-x-0 top-0 bg-white z-[10] h-fit py-6">
          <div className="flex items-center justify-center h-full gap-2 px-2 mx-auto sm:justify-between max-w-7xl">
            <Link
              href="/dashboard"
              className="items-center hidden gap-2 sm:flex"
            >
              <div className="font-light text-2xl flex flex-row ">
                Class<div className="font-medium">Mate</div>
              </div>
            </Link>

            <div className="flex items-center">
              <div className="flex items-center">
                <Button
                  className="p-6 px-8 rounded-full text-sm mr-5"
                  onClick={() => signIn("google")}
                >
                  Free Sign up
                </Button>
              </div>
            </div>
          </div>
        </nav>
      )}
      <div className="min-h-screen flex flex-col justify-center items-center ">
        {windowWidth < 1440 ? (
          <AnimatePresence>
            <motion.div
              className="flex justify-center items-center flex-col z-20"
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
            >
              <div className="border border-black rounded-md p-2 text-lg mb-5">
                Please visit the website from your desktop 🖥
              </div>
              <motion.div
                className="text-center font-light text-5xl flex flex-row font-oi "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ClassMate
              </motion.div>
              <motion.div
                className="text-center font-normal text-xl pb-5 p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Your Personalised Learning Companion
              </motion.div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence>
            <motion.div
              className="flex justify-center items-center flex-col z-20"
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
            >
              <Player
                autoplay
                loop
                src={
                  "https://lottie.host/b2d860fc-aea7-41be-a186-71193e6688d1/jYHsj0muJA.json"
                }
                style={{
                  height: "80px",
                  width: "80px",
                  borderRadius: "24px",
                  border: "3px solid black",
                }}
                className="absolute inset-0 z-10 sm:h-[200px] sm:w-[200px] sm:left-[30%] sm:top-[20%] md:h-[300px] md:w-[300px] md:left-[0%] lg:left-[-38%] lg:top-[22%] -rotate-12"
              />
              {/* <Player
                autoplay
                loop
                src={
                  "https://lottie.host/b2d860fc-aea7-41be-a186-71193e6688d1/jYHsj0muJA.json"
                }
                style={{
                  height: "80px",
                  width: "80px",
                  borderRadius: "24px",
                  border: "3px solid black",
                }}
                className="absolute inset-0 z-10 sm:h-[200px] sm:w-[200px] sm:left-[30%] sm:top-[22%] md:h-[300px] md:w-[300px] md:left-[0%] lg:left-[-36%] lg:top-[25%] -rotate-12"
              /> */}

              {/* <div className="border border-black rounded-md p-2 text-xs mb-5">
                Best viewed on desktop*
              </div> */}
              <motion.div
                className="text-center font-light text-5xl flex flex-row font-oi w-[50%]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Your Personal Learning Companion
              </motion.div>
              <motion.div
                className="text-center font-normal text-2xl pb-5 w-[30%] p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Learn faster with your own friendly AI tutor on a safe online
                space
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button
                  className="bg-purple-500 p-8 px-10 rounded-full text-xl mr-5 mb-20"
                  onClick={() => signIn("google")}
                >
                  Try for Free
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex h-full justify-end items-end flex-col z-20"
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
            >
              <Image
                src="/curriculum.jpg"
                width={1063}
                height={400}
                alt="Hero Image"
                className="width"
                style={{
                  position: "fixed",
                  left: "50%",
                  bottom: "0px",
                  transform: "translate(-50%, -0%)",
                  margin: "0 auto",
                }}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* <div className="rounded-3xl bg-violet-700 w-[652px] h-[640px] shadow-md"> */}
      {/* <div className="w-full h-full rounded-t-3xl backdrop-brightness-75">
          <div className="text-white font-oi text-4xl font-normal p-6 py-8">
            Welcome
          </div>
        </div> */}
      {/* <div className="rounded-3xl bg-white absolute top-[25%] w-[652px] h-[575px] shadow-xl p-8 flex flex-col items-end justify-between">
          <div>
            <div className="font-semibold text-2xl pb-2">
              Welcome to CryptoHack!
            </div>
            <div className="text-base">
              We are here to help you achieve your learning goals with the help
              of learning buddies! Think of them as friendly, knowledgeable
              friends that can help you with your academic studies. Feel free to
              ask for their help for your studies anytime.
            </div>
            <Image
              src="buddy.svg"
              height={120}
              width={560}
              alt={"buddy"}
              className="pt-7"
            />
          </div>
          <Button
            className="p-8 px-10 rounded-full text-md mr-5"
            onClick={() => {
              setIsLoading(true);
              signIn("google");
            }}
          >
            {isLoading ? "Loading..." : "Get Started"}
            {isLoading ? (
              <Loader2 className="w-5 h-5 ml-2 animate-spin" />
            ) : (
              <ArrowRight className="ml-2 w-5 h-5" strokeWidth={3} />
            )}
          </Button>
        </div> */}
    </div>
  );
};

export default Page;
