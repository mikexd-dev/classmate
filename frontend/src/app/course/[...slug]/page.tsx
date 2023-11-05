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
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  params: {
    slug: string[];
  };
};

const CoursePage = async ({ params: { slug } }: Props) => {
  const session = await getAuthSession();
  const [courseId, unitIndexParam, chapterIndexParam] = slug;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      units: {
        include: {
          chapters: {
            include: { questions: true },
          },
        },
      },
    },
  });

  // const userProgress = await prisma.userProgress.findFirst({
  //   where: {
  //     userId: session!.user?.id,
  //     courseId,
  //   },
  // });

  if (!course) {
    return redirect("/dashboard");
  }
  let unitIndex = parseInt(unitIndexParam);
  let chapterIndex = parseInt(chapterIndexParam);

  const unit = course.units[unitIndex];
  if (!unit) {
    return redirect("/dashboard");
  }

  const chapter = unit.chapters[chapterIndex];
  if (!chapter && chapterIndex !== 3) {
    return redirect("/dashboard");
  }
  // const nextChapter = unit.chapters[chapterIndex + 1];
  // const prevChapter = unit.chapters[chapterIndex - 1];

  // console.log(session, "coursepage");

  const chat = await prisma.chats.findFirst({
    where: {
      userId: session!.user?.id,
    },
  });

  return (
    <div className="py-10">
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
      {/* <div className="flex flex-row justify-center items-center mt-5">
        <div className="flex items-center px-2 py-1 mt-2 border-none bg-orange-100 text-xs rounded-xl ">
          <Info className="w-5 mr-3 text-orange-400" />
          <div className="font-normal">
            Note: Complete the Course Progress to redeem the course NFT!
          </div>
        </div>
      </div> */}
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
        <CompanionChat chatId={chat!.id} />
        {/* {chapter.questions.length > 0 && <QuizCards chapter={chapter} />} */}
      </div>

        <div className="flex-3">
          {chapterIndex === 3 ? (
            <MainQuiz unit={unit} unitIndex={unitIndex} />
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
          <CompanionChat />
        </div>
      </div>

      <div className="px-8 mx-auto sm:justify-between max-w-7xl"></div>
    </div>
  );
};

export default CoursePage;
