"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Image from "next/image";
import { Loader2, ArrowRight } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

type Props = {};

const Page = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  if (session?.user) {
    redirect("/onboarding");
  }
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
          <div className="text-white font-oi text-4xl font-normal p-6">
            Welcome
          </div>
        </div>
        <div className="rounded-3xl bg-white absolute top-[23%] w-[652px] h-[575px] shadow-xl p-8 flex flex-col items-end justify-between">
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
        </div>
      </div>
    </div>
  );
};

export default Page;
