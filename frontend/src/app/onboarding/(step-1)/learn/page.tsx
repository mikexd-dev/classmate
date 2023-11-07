"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
type Props = {};

export default function Page(props: Props) {
  return (
    <div
      className="min-h-screen flex justify-center items-center  "
      style={{
        backgroundImage: "url('/background-purple.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
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
            <div className="text-white font-oi text-4xl font-normal p-6">
              Welcome
            </div>
          </div>
          <div className="rounded-3xl bg-white absolute top-[27%] w-[652px] h-[575px] shadow-xl p-8 flex flex-col items-end justify-between">
            <div>
              <div className="font-semibold text-3xl pb-2">
                How to collect your Learning Buddy
              </div>
              <div className="text-xl">
                Learning Buddies come with different personalities. Some of them
                can be friendly and some can be cheeky.
                <br /> <br />
                You can get them using <span className="font-bold ">
                  COIN
                </span>{" "}
                that can be earned by completing modules. Now let’s get started!
              </div>
              <div className="flex flex-row justify-center items-center  ">
                <Player
                  autoplay
                  loop
                  src="https://lottie.host/b2d860fc-aea7-41be-a186-71193e6688d1/jYHsj0muJA.json"
                  style={{
                    height: "120px",
                    width: "120px",
                    borderRadius: "28px",
                    border: "3px solid black",
                  }}
                />
                <Player
                  autoplay
                  loop
                  src="https://lottie.host/fa0dc82d-1ff0-4b04-80dd-3bb343566f02/0ob0BGGD0x.json"
                  style={{
                    height: "250px",
                    width: "250px",
                    // borderRadius: "28px",
                    // border: "3px solid black",
                  }}
                />
                {/* <Image
                  src="../coin.svg"
                  height={126}
                  width={126}
                  alt={"buddy"}
                /> */}
              </div>
            </div>
            <div className="flex flex-row items-between justify-between w-full">
              <Link href={"/onboarding"}>
                <Button
                  className="p-8 px-10 rounded-full text-xl mr-5"
                  variant={"secondary"}
                >
                  <ChevronLeft className="mr-2 w-6 h-6" strokeWidth={3} />
                  Previous
                </Button>
              </Link>

              <Link href={"/onboarding/wallet"}>
                <Button className="p-8 px-10 rounded-full text-xl mr-5">
                  Next
                  <ChevronRight className="ml-2 w-6 h-6" strokeWidth={3} />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
