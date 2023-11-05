"use client";

import CompanionChat from "@/components/course/CompanionChat";
import { CourseProgress } from "@/components/course/CourseProgress";
import CourseSideBar from "@/components/course/CourseSideBar";
import MainQuiz from "@/components/course/MainQuiz";
import MainVideoSummary from "@/components/course/MainVideoSummary";
import ProgressUpdate from "@/components/course/ProgressUpdate";
import QuizCards from "@/components/course/QuizCards";
import Navbar from "@/components/generic/Navbar";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import axios from "axios";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
// import React, { useEffect } from "react";

type Props = {
  params: {
    slug: string[];
  };
};

const CoursePage = ({ params: { slug } }: Props) => {
  const { data: session } = useSession();
  const [course, setCourse] = useState<any>(null);
  const [unitIndex, setUnitIndex] = useState(0);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [unit, setUnit] = useState<any>(null);
  const [chapter, setChapter] = useState<any>(null);
  const [chat, setChat] = useState<any>(null);
  const [courseId, unitIndexParam, chapterIndexParam] = slug;
  const [quiz, setQuiz] = useState<any>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState<any[]>([]);
  const [showAnswer, setAnswer] = useState(false);
  useEffect(() => {
    const fetchCourse = async () => {
      const response = await axios.get(`/api/course/chapters?id=${courseId}`);
      const courseData = response.data;
      setCourse(response.data);
      console.log(response, "course");
      // if (!course) {
      //   return redirect("/dashboard");
      // }
      let unitIndex = parseInt(unitIndexParam);
      let chapterIndex = parseInt(chapterIndexParam);

      const unitData = courseData.units[unitIndex];
      // if (!unit) {
      //   return redirect("/dashboard");
      // }

      const chapterData = unitData.chapters[chapterIndex];
      // if (!chapterData && chapterIndex !== 3) {
      //   return redirect("/dashboard");
      // }
      setUnitIndex(unitIndex);
      setChapterIndex(chapterIndex);
      setUnit(unitData);
      setCourse(courseData);
      setChapter(chapterData);
    };

    const fetchChat = async () => {
      const response = await axios.get(`/api/chat/user`);
      const chatData = response.data;
      setChat(chatData);
    };
    fetchCourse();
    fetchChat();
  }, []);

  return (
    <div className="py-10">
      {course && (
        <Navbar>
          <ProgressUpdate
            unit={unitIndex}
            chapter={chapterIndex}
            course={course}
            courseId={courseId}
            courseTokenId={course.courseTokenId}
            profileTokenId={session?.user?.tokenProfileId!}
          />
        </Navbar>
      )}

      {course && (
        <div className="flex flex-row space-x-8 items-start pt-16 mx-auto sm:justify-between max-w-7xl">
          <div className="flex-1">
            <CourseSideBar
              course={course}
              currentChapterId={
                chapterIndex === 3 ? chapterIndex.toString() : chapter.id
              }
              currentUnit={unitIndex}
            />
          </div>
          <div className="flex-3">
            {chapterIndex === 3 ? (
              <MainQuiz
                unit={unit}
                unitIndex={unitIndex}
                setQuiz={setQuiz}
                quiz={quiz}
                quizStep={quizStep}
                setQuizStep={setQuizStep}
                wrongAnswer={wrongAnswer}
                setWrongAnswer={setWrongAnswer}
                showAnswer={showAnswer}
                setAnswer={setAnswer}
              />
            ) : (
              <MainVideoSummary
                chapter={chapter}
                chapterIndex={chapterIndex}
                unit={unit}
                unitIndex={unitIndex}
              />
            )}
          </div>
          <div className="flex-1">
            {chat && (
              <CompanionChat
                chatId={chat!.id}
                currentQuiz={quiz && quiz[quizStep]}
                showAnswer={showAnswer}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
