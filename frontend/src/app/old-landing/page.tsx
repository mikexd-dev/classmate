"use client";

import { useWalletAuth } from "@/modules/wallet/hooks/useWalletAuth";
import ConnectWallet from "@/components/ConnectWallet";
import { signIn, useSession } from "next-auth/react";
import TypewriterTitle from "@/components/generic/TypeWriter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import CreateNoteDialog from "@/components/course/NoteDialog";
import CreateWalletDialog from "@/components/generic/CreateWalletDialog";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfettiComponent from "@/components/Confetti";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const { isConnecting, isConnected, connect, connectionError, wallet } =
    useWalletAuth();
  const { data: session, status } = useSession();
  const [open, setOpen] = React.useState(false);
  const [newUser, setNewUser] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (
      session &&
      (session?.user?.address == null || session?.user?.address == "")
    ) {
      setOpen(true);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.address) {
      setNewUser(true);
      // router.push("/gallery" + "?" + createQueryString("new", "true"));
    }
  }, [session?.user?.address]);

  const router = useRouter();
  return (
    <div className="bg-gradient-to-r min-h-screen  from-rose-100 to-teal-100">
      {newUser && open && <ConfettiComponent />}
      <CreateWalletDialog open={open} setOpen={setOpen} newUser={newUser} />

      <AnimatePresence>
        <motion.div
          className="flex justify-center items-center min-h-screen flex-col z-20"
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
            src="/roboto.svg"
            width={200}
            height={200}
            alt="Hero Image"
            className="absolute inset-0 z-10  left-[20%] top-[20%] sm:h-[200px] sm:w-[200px] sm:left-[30%] sm:top-[20%] md:h-[300px] md:w-[300px] md:left-[0%] lg:left-[20%] lg:top-[25%]"
          />
          <div className="border border-black rounded-md p-2 text-xs mb-5">
            Best viewed on desktop*
          </div>
          <motion.div
            className="font-light text-8xl flex flex-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div className="font-medium">AI</motion.div>ducation
          </motion.div>
          <motion.div
            className="font-normal text-lg pb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            The future is yours. Supercharge your learning on-chain.
          </motion.div>
          {/* <Image
            src="/pondering.png"
            width={500}
            height={500}
            alt="Hero Image"
            className="absolute inset-0 left-[15%] top-[20%] -z-2"
          /> */}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {session?.user?.address ? (
              <Button
                className=""
                onClick={() => {
                  router.push("/dashboard");
                }}
              >
                {`Let's Go! ${session?.user?.name}`}
                <ArrowRight className="ml-2 w-5 h-5" strokeWidth={3} />
              </Button>
            ) : (
              <Button
                className=""
                onClick={() => {
                  setIsLoading(true);
                  signIn("google");
                }}
              >
                {isLoading ? "loading..." : "Get Started"}
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <ArrowRight className="ml-2 w-5 h-5" strokeWidth={3} />
                )}
              </Button>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
