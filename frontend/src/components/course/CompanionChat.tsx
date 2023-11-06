"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { useChat } from "ai/react";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import MessageList from "../MessageList";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import Image from "next/image";
import BuddySVG from "public/demo-profile.svg";
import { usePathname, useSearchParams } from "next/navigation";

type Props = { chatId: number };

const CompanionChat = ({ chatId }: Props) => {
  const {
    data,
    isLoading: isMessagesLoading,
    refetch,
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  console.log("RQ data ==> ", data);

  const {
    input,
    handleInputChange,
    handleSubmit,
    messages,
    append,
    setInput,
    isLoading: isApiCallLoading,
  } = useChat({
    api: "/api/chat",
    body: {
      chatId,
      userInitiated: true,
    },
    initialMessages: data || [],
  });

  const [updatedMessages, setUpdatedMessages] = useState<Message[]>(messages);

  // scroll to bottom when new message is added
  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [updatedMessages]);

  const pathname = usePathname();
  console.log("pathname ==> ", pathname.includes("course"));

  const { mutate, isLoading } = useMutation({
    // mutating is basically to update data and handle request state
    mutationFn: async (chatId: number) => {
      try {
        const res = await axios.post("/api/chat", {
          chatId,
          userInitiated: false,
          messages: [
            {
              role: "user",
              content:
                "tell me a science fun fact. limit to one sentence. start with 'Fun fact:'",
            },
          ],
        });

        // save to db
        await axios.put("/api/get-messages", {
          chatId,
          content: res.data.choices[0].message.content,
          role: "assistant",
        });

        console.log("res.data ==> ", res.data);

        return res.data;
      } catch (error) {
        console.log("error generating fun fact -> ", error);
      }
    },
  });

  const hasRun = useRef(false); // need this because useEffect runs twice due to React Strict Mode in dev mode

  useEffect(() => {
    if (!hasRun.current && pathname.includes("course")) {
      // mutation.mutate({ chatId });
      mutate(chatId, {
        onSuccess: (data) => {
          console.log("data ==>> ", data);

          // Invalidate (mark as stale) and refetch the chat query
          // queryClient.invalidateQueries(["chat", chatId]);
          refetch();
        },
        onError: (err) => {
          console.log("error generating fun fact -> ", err);
        },
      });
      hasRun.current = true;
    }
  }, [pathname]);

  useEffect(() => {
    console.log("data??? ==> ", data);
    setUpdatedMessages(data!);
  }, [data]);

  return (
    <div className="rounded-3xl bg-stone-200 w-[340px] h-full shadow-md pb-10 mt-5 relative">
      <div className="w-full h-full rounded-t-3xl flex flex-row p-5 pt-2">
        <Image
          src={BuddySVG}
          height={64}
          width={64}
          alt={"buddy"}
          className=""
        />
        <div className="flex flex-col p-5 ">
          <div className="text-black text-sm font-semibold">Gang</div>
          <div className="text-black text-sm font-normal">
            Too friendly for his own good
          </div>
        </div>
      </div>
      <div
        className="rounded-3xl overflow-y-scroll bg-white absolute top-24 w-[340px] h-[38rem] shadow-xl flex flex-col items-end justify-between"
        id="message-container"
      >
        {/* use updated messages here instead of messages to update UI in real time */}
        <MessageList messages={updatedMessages} isLoading={isMessagesLoading} />

        <form
          onSubmit={handleSubmit}
          className="sticky bottom-0 w-full inset-x-0 px-4 py-4 bg-white"
        >
          <div className="flex border-gray-200 border-2 p-1 rounded-[99px]">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask any question..."
              className="w-full border-transparent ring-transparent focus-visible:ring-transparent focus-visible:ring-offset-0 bg-transparent"
            />
            <Button className="bg-purple-600 ml-2 rounded-[99px]">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanionChat;
