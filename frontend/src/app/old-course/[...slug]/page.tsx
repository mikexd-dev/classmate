import { CourseProgress } from "@/components/course/CourseProgress";
import CourseSideBar from "@/components/course/CourseSideBar";
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
  if (!chapter) {
    return redirect("/dashboard");
  }
  const nextChapter = unit.chapters[chapterIndex + 1];
  const prevChapter = unit.chapters[chapterIndex - 1];

  console.log(session, "coursepage");

  return (
    <div className="p-10">
      <Navbar />
      <div className="flex flex-row justify-center items-center mt-5">
        <div className="flex items-center px-2 py-1 mt-2 border-none bg-orange-100 text-xs rounded-xl ">
          <Info className="w-5 mr-3 text-orange-400" />
          <div className="font-normal">
            Note: Complete the Course Progress to redeem the course NFT!
          </div>
        </div>
      </div>
      <div className="flex flex-row space-x-5 justify-end items-start px-8 pt-5 mx-auto sm:justify-between max-w-7xl">
        <CourseSideBar course={course} currentChapterId={chapter.id} />
        <div className="flex-[3]">
          <MainVideoSummary
            chapter={chapter}
            chapterIndex={chapterIndex}
            unit={unit}
            unitIndex={unitIndex}
          />
        </div>

        {chapter.questions.length > 0 && <QuizCards chapter={chapter} />}
      </div>

      <div className="px-8 mx-auto sm:justify-between max-w-7xl">
        <ProgressUpdate
          unit={unitIndex}
          chapter={chapterIndex}
          course={course}
          courseId={courseId}
          courseTokenId={course.courseTokenId}
          profileTokenId={session?.user?.tokenProfileId!}
        />
        {/* <div className="flex pb-8 flex-row justify-between ">
          {prevChapter && (
            <Link
              href={`/course/${course.id}/${unitIndex}/${chapterIndex - 1}`}
              className="flex mt-4 mr-auto w-fit flex-1"
            >
              <div className="flex items-center">
                <ChevronLeft className="w-6 h-6 mr-1" />
                <div className="flex flex-col items-start">
                  <span className="text-sm text-secondary-foreground/60">
                    Previous
                  </span>
                  <span className="text-md font-bold">{prevChapter.name}</span>
                </div>
              </div>
            </Link>
          )}

          {nextChapter && (
            <Link
              href={`/course/${course.id}/${unitIndex}/${chapterIndex + 1}`}
              className="flex mt-4 ml-auto w-fit flex-1 justify-self-end"
            >
              <div className="flex items-end">
                <div className="flex flex-col items-end">
                  <span className="text-sm text-secondary-foreground/60">
                    Next
                  </span>
                  <span className="text-md font-bold text-right">
                    {nextChapter.name}
                  </span>
                </div>
                <ChevronRight className="w-6 h-6 ml-1" />
              </div>
            </Link>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default CoursePage;