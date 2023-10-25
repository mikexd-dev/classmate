import { Icons } from "@/components/generic/Icons";
import { ComethWallet } from "@cometh/connect-sdk";
import { Button } from "./ui/button";

interface ConnectWalletProps {
  connectionError: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
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
      return "Retrieve your Wallet";
    }
  };

  return (
    <>
      {!connectionError ? (
        <Button
          disabled={isConnecting || isConnected || !!connectionError}
          // className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100 disabled:bg-white"
          onClick={connect}
        >
          {getTextButton()}
        </Button>
      ) : (
        <p className="flex items-center justify-center text-gray-900 bg-red-50">
          Connection denied
        </p>
      )}
    </>
  );
}

export default ConnectWallet;
