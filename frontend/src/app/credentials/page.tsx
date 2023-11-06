import { Button } from "@/components/ui/button";
import { useWalletAuth } from "@/modules/wallet/hooks/useWalletAuth";
import React from "react";
import { useSearchParams } from "next/navigation";
import ConnectWallet from "@/components/ConnectWallet";
import { useSession } from "next-auth/react";
import Navbar from "@/components/generic/Navbar";
import { getAuthSession } from "@/lib/auth";
import { Info } from "lucide-react";
type Props = {};

const page = async (props: Props) => {
  const session = await getAuthSession();

  return (
    <div className="bg-white-100">
      <Navbar newToken={session?.user?.token} />
      <div className="flex flex-row mt-16 pt-12 max-w-7xl mx-auto">
        <div className="flex-[1_0_0%] p-5">
          <div className="text-black font-oi text-3xl pb-5">
            Welcome <br />
            {session?.user?.name.split(" ")[0]}
          </div>
          <div className="text-black  text-sm font-light">
            View all your completed courses and track your learning progress
          </div>
          <div className="flex px-2 py-2 mt-2 border-none bg-orange-100 text-xs rounded-xl w-[90%]">
            <Info className="w-8 h-8 mr-3 text-orange-400" />
            <div className="font-normal">
              Note: It might take a while for the course NFT to show up in your
              profile.
            </div>
          </div>
        </div>
        <div className="flex-[3_0_0%] p-5 h-full">
          <iframe
            width="100%"
            height="800px"
            src={`https://tbd-iframe.vercel.app/0x02faade50682498bf0bc7c804919e2b21de54bec/${session?.user?.tokenProfileId}/80001`}
            title="TBD Renderer"
          />
        </div>
      </div>
    </div>
  );
};

export default page;
