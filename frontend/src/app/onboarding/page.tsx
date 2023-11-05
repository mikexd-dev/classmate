"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";

type Props = {};

export default function Page(props: Props) {
  const { data: session, status } = useSession();
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
          <motion.div className="w-full h-full rounded-t-3xl backdrop-brightness-75">
            <div className="text-white font-oi text-4xl font-normal p-6 py-8">
              Welcome
            </div>
          </motion.div>
          <div className="rounded-3xl bg-white absolute top-[27%] w-[652px] h-[575px] shadow-xl p-8 flex flex-col items-end justify-between">
            <div>
              <div className="font-semibold text-3xl pb-2">
                Hey {session?.user?.name.split(" ")[0]}, welcome to CryptoHack!
              </div>
              <div className="text-xl">
                We are here to help you achieve your learning goals with the
                help of learning buddies!
                <br /> <br />
                Think of them as friendly, knowledgeable friends that can help
                you with your academic studies.
              </div>
              <Image
                src="buddy.svg"
                height={120}
                width={560}
                alt={"buddy"}
                className="pt-7"
              />
            </div>

            <Link href={"/onboarding/learn"}>
              <Button className="p-8 px-10 rounded-full text-xl mr-5">
                Next
                <ChevronRight className="ml-2 w-6 h-6" strokeWidth={3} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
