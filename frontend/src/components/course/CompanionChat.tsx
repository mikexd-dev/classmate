"use client";
import React, { useEffect } from "react";
import { Input } from "../ui/input";
import { useChat, useCompletion } from "ai/react";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import MessageList from "../MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import Image from "next/image";
import BuddySVG from "public/demo-profile.svg";
import { useSession } from "next-auth/react";
import { Player } from "@lottiefiles/react-lottie-player";
import { subscribe, useSnapshot, snapshot } from "valtio";
import { debounce } from "lodash";
import { uuidV4 } from "ethers";
import { state } from "./MainQuiz";
import { createDropdownMenuScope } from "@radix-ui/react-dropdown-menu";

const profiles = [
  {
    name: "Gang",
    image:
      "https://lottie.host/8cf62b57-b445-42e8-88fd-efce01619d88/vTIR5AUvRu.json",
    description: "Friendly Soul",
  },
  {
    name: "Mike",
    image:
      "https://lottie.host/62814086-9223-42b9-8f1a-2226f2fa0ee0/eLjJebcnDC.json",
    description: "Rebellious Hunk",
  },
  {
    name: "Terry",
    image:
      "https://lottie.host/0a34a2ae-759c-45fd-a975-e69c50404461/U6jSLu1A2r.json",
    description: "Funny Bunny",
  },
];

type Props = { chatId: number; currentQuiz: any; showAnswer: boolean };

const CompanionChat = ({ chatId, currentQuiz, showAnswer }: Props) => {
  const { data: session } = useSession();
  const [isLoadingQuizExplanation, setLoadingQuizExplanation] =
    React.useState(false);
  const [quiz, setQuiz] = React.useState<any>(null);
  const [profile, setProfile] = React.useState(profiles[0]);
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { complete, completion } = useCompletion({
    api: "/api/chat",
    body: {
      chatId,
    },
    onResponse: (response) => {
      // console.log("response", response);
      // setQuiz(response.data.quiz);
    },
    onFinish: () => {
      // console.log("finished ->>>", completion, messages[messages.length - 1]);
      // if (completion !== "") {
      //   setMessages([
      //     ...messages,
      //     {
      //       id: messages[messages.length - 1].id + 1,
      //       role: "assistant",
      //       content: completion,
      //     },
      //   ]);
      // }
    },
  });

  let prevState = snapshot(state);
  const snap = useSnapshot(state);

  useEffect(() => {
    const debouncedLogHi = debounce(async () => {
      //TODO: terry this is like the only method i can figure out how to work using vercel ai, u can see if there is a better way, but it works now just without streaming
      if (currentQuiz?.question === state.quizQnAns?.question && showAnswer) {
        setLoadingQuizExplanation(true);

        // api call to openAI completion
        const completed = await complete(JSON.stringify(state.quizQnAns));
        const newMessages2: any = [
          ...messages,
          {
            id: messages[messages.length - 1].id + 1,
            role: "assistant",
            content: completed,
          },
        ];
        setMessages([...newMessages2]);
        setLoadingQuizExplanation(false);
      }
    }, 200);

    debouncedLogHi();
  }, [snap.quizQnAns]);

  const onboardingInfo = `
      Student's name: ${session?.user?.name.split(" ")[0]}
      Student's grade: ${session?.user.grade} (Express stream)
    `;

  const {
    input,
    handleInputChange,
    handleSubmit,
    messages,
    setMessages,
    isLoading: isMessageLoading,
  } = useChat({
    api: "/api/chat",
    body: {
      chatId,
      onboardingInfo,
      quiz,
    },
    initialMessages: data || [],
  });

  // scroll to bottom when new message is added
  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
    if (session?.user?.buddy === "Gang") setProfile(profiles[0]);
    if (session?.user?.buddy === "Mike") setProfile(profiles[1]);
    if (session?.user?.buddy === "Terry") setProfile(profiles[2]);
  }, [messages, session?.user]);

  return (
    <div className="rounded-3xl bg-stone-200 min-w-[340px] h-full shadow-md pb-10 mt-5">
      <div className="w-full h-full rounded-t-3xl flex flex-row p-5 pt-3">
        <Player
          autoplay
          loop
          src={profile.image}
          style={{
            height: "64px",
            width: "64px",
            // borderRadius: "24px",
            // border: "3px solid black",
          }}
          className="hover:bg-sky-700"
        />
        <div className="flex flex-col p-5 ">
          <div className="text-black text-sm font-semibold">{profile.name}</div>
          <div className="text-black text-sm font-normal">
            {profile.description}
          </div>
        </div>
      </div>
      <div
        className="rounded-3xl overflow-scroll bg-white absolute top-[22%] w-[340px] h-[500px] shadow-xl flex flex-col items-start justify-between"
        id="message-container"
      >
        <MessageList messages={messages} isLoading={isLoading} />

        <form
          onSubmit={handleSubmit}
          className="sticky bottom-0 w-full inset-x-0 px-4 pb-4 py-2 bg-white"
        >
          {(isLoadingQuizExplanation || isMessageLoading) && (
            <div className="flex flex-start w-full">
              <Player
                autoplay
                loop
                src={
                  "https://lottie.host/3238e0e1-dd8d-43f8-8727-c041f22d2d71/oawumDLEXG.json"
                }
                style={{
                  height: "30px",
                  width: "30px",
                  // borderRadius: "24px",
                  // border: "3px solid black",
                }}
                className="relative bottom-0"
              />
            </div>
          )}

          <div className="flex">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask any question..."
              className="w-full"
            />
            <Button className="bg-purple-600 ml-2">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanionChat;
