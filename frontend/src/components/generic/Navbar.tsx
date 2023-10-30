// "use client";

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

type Props = {};

const Navbar = async ({ children }: any) => {
  // const [open, setOpen] = React.useState(false);
  let profileTokenid: any = null;
  const session = await getAuthSession();
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
          <div className="font-light text-2xl flex flex-row pl-8">
            <div className="font-medium">Crypto</div>Hack
          </div>
        </Link>
        {children}
        <div className="flex items-center">
          {/* {session?.user && (
            <>
              <Link
                href="/credentials"
                className="items-center hidden gap-2 sm:flex"
              >
                <Button
                  className="mr-3 bg-pink-200 text-black hover:text-white"
                  // onClick={() => setOpen(true)}
                >
                  Credentials
                </Button>
              </Link>
            </>
          )} */}
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
