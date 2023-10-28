import { Icons } from "@/components/generic/Icons";
import { ComethWallet } from "@cometh/connect-sdk";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";

interface ConnectWalletProps {
  connectionError: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<any>;
  wallet: ComethWallet;
}

function ConnectWallet({
  connectionError,
  isConnecting,
  isConnected,
  connect,
  wallet,
}: ConnectWalletProps): JSX.Element {
  const getTextButton = () => {
    if (isConnected) {
      return (
        <>
          <a
            href={`https://mumbai.polygonscan.com/address/${wallet.getAddress()}`}
            target="_blank"
          >
            {"Wallet connected"}
          </a>
        </>
      );
    } else if (isConnecting) {
      return (
        <>
          <Icons.spinner className="h-6 w-6 animate-spin mr-3" />
          {"Retrieving wallet..."}
        </>
      );
    } else {
      return (
        <>
          <div>Get A Wallet</div>
          <ChevronRight className="ml-2 w-6 h-6" strokeWidth={3} />
        </>
      );
    }
  };

  return (
    <>
      {!connectionError ? (
        <Button
          disabled={isConnecting || isConnected || !!connectionError}
          className="p-8 px-10 rounded-full text-xl mr-5 bg-purple-600 drop-shadow-md cursor-pointer"
          onClick={connect}
          style={{ cursor: "pointer !important" }}
        >
          {getTextButton()}
        </Button>
      ) : (
        <Button
          disabled={true}
          className="p-8 px-10 rounded-full text-xl mr-5 bg-red-600 drop-shadow-md cursor-pointer"
        >
          Connection Denied
        </Button>
      )}
    </>
  );
}

export default ConnectWallet;
