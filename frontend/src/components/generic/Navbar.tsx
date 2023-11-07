"use client";

import Link from "next/link";
import React from "react";
import SignInButton from "../SignInButton";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "../UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/button";
import ProfileDialog from "./ProfileDialog";
import { useSession } from "next-auth/react";
import { profile } from "console";
import Image from "next/image";
type Props = {};

const Navbar = ({ children, newToken }: any) => {
  // const [open, setOpen] = React.useState(false);
  let profileTokenid: any = null;
  const { data: session } = useSession();
  // const session = await getAuthSession();
  // profileTokenid = session?.user?.tokenProfileId as any;

  return (
    <nav className="fixed inset-x-0 top-0 bg-white z-[10] h-fit py-6">
      {/* <ProfileDialog
        open={open}
        setOpen={setOpen}
        profileTokenId={profileTokenid}
      /> */}
      <div className="flex items-center justify-center h-full gap-2 px-2 mx-auto sm:justify-between max-w-7xl">
        <Link href="/dashboard" className="items-center hidden gap-2 sm:flex">
          <div className="font-normal text-2xl flex flex-row justify-center items-center">
            <Image
              src="/logo.svg"
              height={44}
              width={44}
              alt={"logo"}
              className="mr-2"
            />
            Classmate
          </div>
        </Link>
        {children}
        <div className="flex items-center">
          {session?.user && (
            <>
              <Link
                href="/credentials"
                className="items-center hidden gap-2 sm:flex pr-5"
              >
                {/* <Button
                  className="mr-3 bg-pink-200 text-black hover:text-white"
                  // onClick={() => setOpen(true)}
                >
                  Credentials
                </Button> */}
                <div className="flex flex-row items-center justify-center rounded-full border border-yellow-500 bg-yellow-100 text-yellow-800 text-xs font-light font-oi p-2 w-20">
                  {session?.user?.token}
                  <Image
                    src="/coin.svg"
                    height={30}
                    width={30}
                    alt={"token"}
                    className="pl-2"
                  />
                </div>
              </Link>
            </>
          )}
          {/* <ThemeToggle className="mr-3" /> */}
          <div className="flex items-center">
            {session?.user ? (
              // eslint-disable-next-line
              <UserAccountNav user={session?.user} />
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
