import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";

type Props = {
  isLoading: boolean;
  messages: Message[];
};

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!messages) return <></>;

  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-10": message.role === "user",
              "justify-start ml-6": message.role === "assistant",
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
              <Markdown
                className={"overflow-y-auto max-w-[250px] overflow-x-hidden"}
                remarkPlugins={[remarkBreaks]}
                children={message.content.replace(/\n/gi, "&nbsp; \n")}
              />
              {/* <p>{message.content}</p> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
