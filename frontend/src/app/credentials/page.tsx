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
  console.log(session, "route.query");

  return (
    <div>
      <Navbar />
      <div className="py-8 mx-auto max-w-7xl mt-10 px-10 flex flex-col items-center justify-center">
        <div className="text-3xl font-light">AIducation Credentials</div>
        <div className="text-sm font-light w-[50%] pt-3">
          All course NFTs will be minted directly to your ERC6551 profile token
          bound account. This help to keep your wallet clean and tidy, and
          organise all Aiducation related credentials (and future incentives 😉)
          in one place.
        </div>
        <div className="flex items-center px-2 py-1 mt-2 border-none bg-orange-100 text-xs rounded-xl w-[50%]">
          <Info className="w-5 mr-3 text-orange-400" />
          <div className="font-normal">
            Note: Click on the top left hand corner of the profile image to see
            all the course NFT within the token. It might also take a while for
            the course NFT to show up in your profile.
          </div>
        </div>

        <iframe
          width="600"
          height="600"
          src={`https://iframe-tokenbound.vercel.app/0x22c9d6fa7e72f751f8af7f81a333f068c9d9a0ef/${session?.user?.tokenProfileId}/80001`}
          title="YouTube video player"
        />
      </div>
    </div>
  );
};

export default page;
