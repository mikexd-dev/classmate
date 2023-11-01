"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import { GradeForm } from "@/components/generic/GradeForm";
import { useRouter } from "next/navigation";
import { TopicsForm } from "@/components/generic/TopicsForm";
type Props = {};

export default function Page(props: Props) {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState([]);

  const router = useRouter();
  const updateTopics = async () => {
    setIsLoading(true);
    const generatedQuiz = await generateQuiz();
    const res = await fetch("/api/users/topics", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topics, quiz: generatedQuiz }),
    });
    const data = await res.json();
    // const res1 = await fetch("/api/users/quiz", {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ quiz: generatedQuiz }),
    // });
    // const data1 = await res1.json();
    console.log(data.data, "updated");
    localStorage.setItem("quiz", JSON.stringify(generatedQuiz));
    router.push("/onboarding/quiz");
    setIsLoading(false);

    // if (
    //   JSON.stringify(data.data?.topics) === JSON.stringify(topics) &&
    //   data1.data?.onBoardingQuiz?.length > 0
    // ) {
    //   router.push("/onboarding/quiz");
    // }
  };

  async function generateQuiz() {
    const res = await fetch("/api/users/quiz", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data, quiz, "quiz");
    setQuiz(data?.data);
    return data?.data;
  }

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
          <div className="text-white font-oi text-4xl font-normal p-6 py-8">
            Topics
          </div>
        </div>
        <div className="rounded-3xl bg-white absolute top-[25%] w-[652px] h-[575px] shadow-xl p-8 flex flex-col  justify-between">
          <div>
            <TopicsForm setTopics={setTopics} topics={topics} />
          </div>
          <div className="flex flex-row items-between justify-between w-full">
            <Link href={"/onboarding"}>
              <Button
                className="p-8 px-10 rounded-full text-xl mr-5"
                variant={"secondary"}
              >
                <ChevronLeft className="mr-2 w-6 h-6" strokeWidth={3} />
                Previous
              </Button>
            </Link>

            <Button
              className="p-8 px-10 rounded-full text-xl mr-5"
              onClick={() => updateTopics()}
              disabled={topics.length === 0 || isLoading}
            >
              {isLoading ? "Generating Quiz..." : "Next"}
              {!isLoading && (
                <ChevronRight className="ml-2 w-6 h-6" strokeWidth={3} />
              )}
              {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
