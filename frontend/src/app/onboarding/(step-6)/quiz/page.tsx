"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { QuizForm } from "@/components/generic/QuizForm";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import input from "postcss/lib/input";
import { useMutation } from "@tanstack/react-query";
import ConfirmChapters from "@/components/course/ConfirmChapters";
import { set } from "zod";
import { AnimatePresence, motion } from "framer-motion";
type Props = {};

export default function Page(props: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [quiz, setQuiz] = useState<any[]>([]);
  const [quizStep, setQuizStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [isFetchLoading, setIsLoading] = useState(true);
  const [option, setOption] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState<string[]>([]);
  const [wrongAnswer, setWrongAnswer] = useState<string[]>([]);
  const [isGeneratingCourse, setGeneratingCourse] = useState(false);
  const [course, setCourse] = useState<any>({});
  const [courseStart, setStartCourse] = useState(false);

  const { mutate: fetchQuiz, isLoading: fetchQuizLoading } = useMutation({
    mutationFn: async (data) => {
      try {
        const res: any = await fetch("/api/users/quiz", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        return data?.data;
      } catch (e: any) {
        console.log(e, "error");
        throw new Error(e);
      }
    },
  });

  useEffect(() => {
    // async function fetchQuiz() {
    //   const res = await fetch("/api/users/quiz", {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   const data = await res.json();
    //   if (quiz.length === 0) setQuiz(data?.data);
    //   setIsLoading(false);
    // }
    // fetchQuiz(undefined, {
    //   onSuccess: (data) => {
    //     console.log(data, "data quiz");
    //     setQuiz(data);
    //   },
    //   onError: () => {
    //     console.log("error");
    //   },
    // });
    const quizStored = localStorage.getItem("quiz");
    setQuiz(JSON.parse(quizStored!));
    console.log(session, "session");
  }, [session]);

  const checkAnswer = () => {
    const currentOption: any = quiz[quizStep];
    if (option === currentOption.answer) {
      // toast({
      //   title: "Correct!",
      //   description: "You have answered correctly!",
      // });
      if (correctAnswer.includes(currentOption.question)) {
        setCorrectAnswer([...correctAnswer]);
      } else {
        setCorrectAnswer([...correctAnswer, currentOption.question]);
      }
    } else {
      // toast({
      //   title: "Incorrect!",
      //   variant: "destructive",
      //   description:
      //     "You have answered incorrectly! " + currentOption.reasoning,
      // });
      if (wrongAnswer.includes(currentOption.question)) {
        setWrongAnswer([...wrongAnswer]);
      } else {
        setWrongAnswer([...wrongAnswer, currentOption.question]);
      }
    }
  };

  const nextQuestion = () => {
    checkAnswer();
    setQuizStep(quizStep + 1);
    setProgress(progress + 20);
  };

  const previousQuestion = () => {
    setQuizStep(quizStep - 1);
    setProgress(progress - 20);
  };

  const { mutate: createChapters, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/course/chapters", {
        title: "School Science",
        wrongAnswers: wrongAnswer,
      });
      return response.data;
    },
  });

  const { mutate: updateToken } = useMutation({
    mutationFn: async () => {
      const response = await axios.put("/api/users/token", {
        token: 200,
      });
      return response.data;
    },
  });

  const generateCourseOutline = async () => {
    // update quiz token
    const response = await axios.put("/api/users/token", {
      token: 200,
    });
    createChapters(undefined, {
      onSuccess: ({ course }) => {
        toast({
          title: "Success",
          description: "Course created",
        });
        router.push(`/create/${course.id}`);
        setCourse(course);
        console.log(course, "course_id");
        setQuizStep(quizStep + 1);
        setProgress(progress + 20);
        setGeneratingCourse(true);
        // router.push(`/create/${course_id}`);
      },

      onError: () => {
        toast({
          title: "Error",
          description: "Error creating course",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center  "
      style={{
        backgroundImage: "url('/background-purple.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 1,
              ease: [0.5, 0.71, 1, 1.5],
              delayChildren: 0.5,
              staggerChildren: 0.5,
            },
          }}
          className="rounded-3xl bg-violet-700 w-[652px] h-[640px] shadow-md"
        >
          <div className="w-full h-full rounded-t-3xl backdrop-brightness-75">
            <div className="text-white font-oi text-4xl font-normal p-6">
              {isGeneratingCourse ? "Course Outline..." : "Quiz"}
            </div>
          </div>
          <div className="rounded-3xl bg-white absolute top-[27%] w-[652px] h-[575px] shadow-xl p-8 flex flex-col items-start justify-between">
            {quizStep === -1 ? (
              <div>
                <Image
                  src="../quiz.svg"
                  height={160}
                  width={588}
                  alt={"buddy"}
                  className="pb-5"
                />
                <div className="font-semibold text-2xl pb-2">
                  Here’s a short quiz to help us create your very own learning
                  course!
                </div>
                <div className="text-base">
                  They are 5 short questions that will take you less than 5
                  minutes to complete them.
                </div>
                <Image
                  src="../two-hundred-credits.svg"
                  height={52}
                  width={151}
                  alt={"buddy"}
                  className="pt-7"
                />
              </div>
            ) : quizStep < 5 ? (
              <div>
                <div className="font-semibold text-3xl pb-2">
                  {quizStep + 1}. {quiz[quizStep].question!}
                </div>
                <div className="pt-7">
                  <QuizForm options={quiz[quizStep]} setOption={setOption} />
                </div>
              </div>
            ) : (
              <div>
                <div className="font-semibold text-3xl">
                  Generating your learning plan
                </div>
                {/* <ConfirmChapters
                  course={course}
                  setStartCourse={setStartCourse}
                /> */}
              </div>
            )}

            <div className="flex flex-row items-between justify-between w-full">
              {quizStep === -1 ? (
                <Link href={"/onboarding/topics"}>
                  <Button
                    className="p-8 px-10 rounded-full text-xl mr-5"
                    variant={"secondary"}
                  >
                    <ChevronLeft className="mr-2 w-6 h-6" strokeWidth={3} />
                    Previous
                  </Button>
                </Link>
              ) : (
                quizStep < 5 && (
                  <Button
                    className="p-8 px-10 rounded-full text-xl mr-5"
                    variant={"secondary"}
                    onClick={() => previousQuestion()}
                  >
                    <ChevronLeft className="mr-2 w-6 h-6" strokeWidth={3} />
                    Previous
                  </Button>
                )
              )}
              {quizStep === -1 && (
                <Button
                  className="p-8 px-10 rounded-full text-xl mr-5 bg-purple-600 drop-shadow-md cursor-pointer"
                  onClick={() => setQuizStep(0)}
                  disabled={fetchQuizLoading}
                >
                  {fetchQuizLoading ? "Fetching Quiz..." : "Let's Start"}
                  <ChevronRight className="ml-2 w-6 h-6" strokeWidth={3} />
                </Button>
              )}
              {quizStep !== -1 && quizStep < 4 && (
                <Button
                  className="p-8 px-10 rounded-full text-xl mr-5"
                  onClick={() => nextQuestion()}
                >
                  Next
                  <ChevronRight className="ml-2 w-6 h-6" strokeWidth={3} />
                </Button>
              )}
              {quizStep === 4 && (
                <Button
                  className="p-8 px-10 rounded-full text-xl mr-5 bg-purple-600 drop-shadow-md cursor-pointer"
                  onClick={() => generateCourseOutline()}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Course Outline..." : "Let's Go"}
                  <ChevronRight className="ml-2 w-6 h-6" strokeWidth={3} />
                </Button>
              )}
            </div>
            {/* {isGeneratingCourse && (
              <div className="flex flex-col items-end w-full pt-2">
                <Link href={`/course/${course.id}/0/0`}>
                  <Button
                    className="p-8 px-10 rounded-full text-xl mr-5 bg-purple-600 drop-shadow-md cursor-pointer"
                    disabled={courseStart}
                  >
                    {"Let's Start"}
                    <ChevronRight className="ml-2 w-6 h-6" strokeWidth={3} />
                  </Button>
                </Link>
              </div>
            )} */}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
