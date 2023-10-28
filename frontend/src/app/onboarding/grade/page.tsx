"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import { GradeForm } from "@/components/generic/GradeForm";
type Props = {};

export default function page(props: Props) {
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
        <div className="rounded-3xl bg-white absolute top-[23%] w-[652px] h-[575px] shadow-xl p-8 flex flex-col  justify-between">
          <div>
            <div className="font-semibold text-3xl pb-2">
              What science grade are you in?
            </div>
            <GradeForm />
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
      </div>
    </div>
  );
}
