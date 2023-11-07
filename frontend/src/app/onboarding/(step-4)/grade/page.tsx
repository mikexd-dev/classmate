"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import { GradeForm } from "@/components/generic/GradeForm";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
type Props = {};

export default function Page(props: Props) {
  const [grade, setGrade] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const updateGrade = async () => {
    setIsLoading(true);
    const res = await fetch("/api/users/grade", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ grade }),
    });
    const data = await res.json();

    setIsLoading(false);
    if (data.data?.grade === grade) {
      router.push("/onboarding/topics");
    }
  };
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
            <div className="text-white font-oi text-4xl font-normal p-6 py-8">
              Grade
            </div>
          </div>
          <div className="rounded-3xl bg-white absolute top-[27%] w-[652px] h-[575px] shadow-xl p-8 flex flex-col  justify-between">
            <div>
              <GradeForm setGrade={setGrade} />
            </div>
            <div className="flex flex-row items-between justify-between w-full">
              <Link href={"/onboarding/buddy"}>
                <Button
                  className="p-8 px-10 rounded-full text-xl mr-5"
                  variant={"secondary"}
                >
                  <ChevronLeft className="mr-2 w-6 h-6" strokeWidth={3} />
                  Previous
                </Button>
              </Link>

              <Button
                className="p-8 px-10 rounded-full text-xl mr-5"
                onClick={() => updateGrade()}
                disabled={grade === "" || isLoading}
              >
                Next
                {!isLoading && (
                  <ChevronRight className="ml-2 w-6 h-6" strokeWidth={3} />
                )}
                {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
