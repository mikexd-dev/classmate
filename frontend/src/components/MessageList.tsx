import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";
import { MarkdownComponent } from "./Markdown";
import remarkBreaks from "remark-breaks";
import axios from "axios";
import { checkFileExist } from "@/lib/s3";
import { hashMessage } from "ethers";

type Props = {
  isLoading: boolean;
  messages: Message[];
  chatId: string;
  isRendering: boolean;
};

const MessageList = ({ messages, isLoading, chatId, isRendering }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!messages) return <></>;

  return (
    <div className="flex flex-col gap-4 p-4 pl-6">
      {messages.map((message, index) => {
        // console.log(message);
        // if (message.role === "assistant") {
        //   await generateVoice(message.id);
        // }
        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-10": message.role === "user",
              "justify-start": message.role === "assistant",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 text-sm py-2 shadow-md ring-1 ring-gray-900/10",
                {
                  "bg-purple-600 text-white": message.role === "user",
                }
              )}
            >
              <MarkdownComponent
                markdown={message.content}
                messageId={hashMessage(chatId + message?.createdAt?.toString())}
                messageRole={message.role}
                chatId={chatId}
                message={message}
                isRendering={isRendering}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
