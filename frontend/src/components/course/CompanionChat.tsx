"use client";
import React, { useEffect } from "react";
import { Input } from "../ui/input";
import { useChat, useCompletion } from "ai/react";
import { Button } from "../ui/button";
import { Send, Mic } from "lucide-react";
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
import { hashMessage, uuidV4 } from "ethers";
import { state } from "./MainQuiz";
import { createDropdownMenuScope } from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { checkFileExist } from "@/lib/s3";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { cn } from "@/lib";

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
  const [audio, setAudio] = React.useState<any>(null);
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

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  let prevState = snapshot(state);
  const snap = useSnapshot(state);

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

  const { complete, completion } = useCompletion({
    api: "/api/chat",
    body: {
      chatId,
      onboardingInfo: messages,
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
  }, [messages, session?.user, chatId]);

  useEffect(() => {
    const voiceSend = async () => {
      const message = transcript;

      if (message.toLowerCase().includes("send message")) {
        resetTranscript();

        const newMessages1: any = [
          ...messages,
          {
            id: messages[messages.length - 1].id + 1,
            role: "user",
            // remove hey classmate from transcript
            content: transcript
              .toLowerCase()
              .replace("send message", "")
              .trim(),
          },
        ];
        setMessages([...newMessages1]);
        setLoadingQuizExplanation(true);
        const completed = await complete(
          transcript.toLowerCase().replace("send message", "").trim()
        );

        const newMessages2: any = [
          ...newMessages1,
          {
            id: newMessages1[newMessages1.length - 1].id + 1,
            role: "assistant",
            content: completed,
          },
        ];
        setMessages([...newMessages2]);
        setLoadingQuizExplanation(false);
        setAudio(true);
      }
    };
    voiceSend();
  }, [transcript]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 2,
            ease: [0.5, 0.71, 1, 1.5],
            delayChildren: 0.5,
            staggerChildren: 0.5,
          },
        }}
        className="rounded-3xl bg-stone-200 min-w-[340px] h-full shadow-md pb-10 mt-5"
      >
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
            <div className="text-black text-sm font-semibold">
              {profile.name}
            </div>
            <div className="text-black text-sm font-normal">
              {profile.description}
            </div>
          </div>
        </div>
        <div
          className="rounded-3xl overflow-scroll bg-white absolute top-[22%] w-[340px] h-[500px] shadow-xl flex flex-col items-end justify-between"
          id="message-container"
        >
          <MessageList
            messages={messages}
            isLoading={isLoading}
            chatId={chatId.toString()}
            isRendering={isMessageLoading}
          />

          {messages[messages.length - 1]?.role === "assistant" &&
            !(isLoadingQuizExplanation || isMessageLoading) && (
              <div>
                <audio
                  id="playaudio"
                  // controls
                  autoPlay={audio}
                  className="pr-10"
                  src={`https://aiclassmate.s3.ap-southeast-1.amazonaws.com/voice/${chatId}/${hashMessage(
                    chatId + messages[messages.length - 1]?.content
                  )}.mp3`}
                ></audio>
              </div>
            )}
          <form
            onSubmit={handleSubmit}
            className="sticky bottom-0 w-full inset-x-0 px-4 pb-4 my-2 bg-white"
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

            <div className="flex items-center">
              <Input
                value={input || transcript}
                onChange={handleInputChange}
                placeholder="Ask any question..."
                className="w-full"
              />
              <div>
                <div
                  className={cn("bg-black rounded-full ml-2 p-3", {
                    "bg-red-600 text-white": listening,
                    "bg-black text-white": !listening,
                  })}
                  onClick={
                    !listening
                      ? SpeechRecognition.startListening
                      : SpeechRecognition.stopListening
                  }
                >
                  <Mic className="h-4 w-4" />
                </div>
              </div>
              <Button className="bg-purple-600 ml-2">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompanionChat;
