"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import { LogOut, ExternalLink } from "lucide-react";
import UserAvatar from "./generic/UserAvatar";
import { useWalletAuth } from "@/modules/wallet/hooks/useWalletAuth";
import { shortenEthAddress } from "@/lib";

type Props = {
  user: User;
};

const UserAccountNav = ({ user }: Props) => {
  const { isConnecting, isConnected, connect, connectionError, wallet } =
    useWalletAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.name && <p className="font-medium">{user.name}</p>}
            {user?.email && (
              <p className="w-[200px] truncate text-sm text-secondary-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            window.open(
              `https://mumbai.polygonscan.com/address/${user?.address}`,
              "_blank"
            );
          }}
          className="cursor-pointer"
        >
          {user?.address
            ? shortenEthAddress(user?.address as string)
            : "loading wallet..."}
          <ExternalLink className="w-4 h-4 ml-2" />
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            signOut();
          }}
          className="cursor-pointer"
        >
          Sign out
          <LogOut className="w-4 h-4 ml-2" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
