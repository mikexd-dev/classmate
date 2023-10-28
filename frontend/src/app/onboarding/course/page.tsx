"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {};

const onboardingSteps = {
  "buddy-selection": {
    title: "Learning Buddy",
    description:
      "Select your first learning buddy. He will help you in your learning journey.. the fun way!",
    type: "image",
    content: [
      {
        profleName: "Gang",
        profileImage: "gang.svg",
        profileDescription: "Friendly Soul",
      },
      {
        profleName: "Mike",
        profileImage: "mike.svg",
        profileDescription: "Rebellious Hunk",
      },
      {
        profleName: "Terry",
        profileImage: "terry.svg",
        profileDescription: "Funny Bunny",
      },
    ],
    button: "Next",
  },
  "grade-selection": {
    title: "Grade",
    description: "Which science grade are you in?",
    type: "radio",
    content: ["Primary 3", "Primary 4", "Primary 5", "Primary 6"],
    button: "Next",
  },
  "topics-selection": {
    title: "Topics",
    description:
      "Help us to talior your learning plan by sharing with us on the topics you have learnt in school.",
    type: "checkbox",
    content: [
      "Cycle in plants",
      "Interaction of forces",
      "Energy Forms",
      "Human Digestive System",
      "I have not started on any topics yet",
    ],
    button: "Next",
  },
  quiz: {
    title: "Quiz",
    description:
      "Quiz time! Here’s a short quiz to help us create your personalised learning course!",
    subDescription:
      "They are 10 short questions that will take you less than 5 minutes to complete them. It will earn you coins to redeem other learning buddies too!",
    type: "landing",
    content: [], // to be generated
    button: "I'm Ready",
    points: 20,
  },
  "course-generation": {
    title: "Loading...",
    description: "Generating your learning plan...",
    type: "generating",
    content: [], // to be generated
    button: "Let's Go!",
  },
};

export default function page(props: Props) {
  return (
    <div
      className="min-h-screen flex justify-center items-center  "
      style={{
        backgroundImage: "url('/background-purple.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="rounded-3xl bg-violet-700 w-[652px] h-[640px] shadow-md">
        <div className="w-full h-full rounded-t-3xl backdrop-brightness-75">
          <div className="text-white font-oi text-4xl font-normal p-6">
            Welcome
          </div>
        </div>
        <div className="rounded-3xl bg-white absolute top-[27%] w-[652px] h-[575px] shadow-xl p-8 flex flex-col items-end justify-between">
          <div>
            <div className="font-semibold text-2xl pb-2">
              Hey Terry, welcome to CryptoHack!
            </div>
            <div className="text-base">
              We are here to help you achieve your learning goals with the help
              of learning buddies! Think of them as friendly, knowledgeable
              friends that can help you with your academic studies. Feel free to
              ask for their help for your studies anytime.
              <br /> <br />
              They come with different personalities. Therefore, they will
              interact with you in different ways. Some of them can be friendly
              and some can be cheeky. You can get them using COINS that can be
              earned by completing modules.
            </div>
            <Image
              src="buddy.svg"
              height={120}
              width={560}
              alt={"buddy"}
              className="pt-7"
            />
          </div>

          <Link href={"/dashboard"}>
            <Button className="p-8 px-10 rounded-full text-md mr-5">
              Let's Go!
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
