"use client";
import { cn } from "@/lib/utils";
import { Chapter, Course, Unit } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { Separator } from "@/components/ui/separator";
import {
  faCheckCircle,
  faEdit,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "../ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
  currentChapterId: string;
  currentUnit: any;
  progress: any;
  isCompleted: boolean;
};

const CourseSideBar = ({
  course,
  currentChapterId,
  currentUnit,
  progress,
  isCompleted,
}: Props) => {
  function getCurrentChapters(course: any, unit: any, chapter: any): number {
    if (unit === 0) {
      return chapter + 1 + unit;
    } else if (unit === 1) {
      return chapter + 4 + unit;
    } else {
      return chapter + 7 + unit;
    }
  }

  return (
    <div className="min-w-[240px] max-w-[300px] px-2 rounded-r-3xl ">
      {/* <h1 className="text-lg font-bold">{course.name}</h1> */}
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
        >
          {progress === 100 && (
            <div className="mt-4 bg-purple-100 rounded-xl p-2">
              <div className="text-stone-600 text-sm pb-1">REVISION TOPICS</div>
              <Link
                href={`/course/${course.id}/${0}/${3}`}
                className={cn("text-black text-sm ")}
              >
                <div
                  className={cn(
                    "flex flex-row items-center justify-start p-2 pl-3 text-sm",
                    {
                      "font-semibold":
                        currentChapterId === "3" && currentUnit === 0,
                    }
                  )}
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    style={{ color: "purple" }}
                    className="h-3 w-3 mr-2"
                  />
                  {course.units[0]?.name.replace(/^.*:/, "") ||
                    course.units[0].name}{" "}
                  Quiz
                </div>
              </Link>

              <Link
                href={`/course/${course.id}/${0}/${3}`}
                className={cn("text-black text-sm ")}
              >
                <div
                  className={cn(
                    "flex flex-row items-center justify-start p-2 pl-3 text-sm",
                    {
                      "font-semibold":
                        currentChapterId === "3" && currentUnit === 1,
                    }
                  )}
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    style={{ color: "purple" }}
                    className="h-3 w-3 mr-2"
                  />
                  {course.units[1]?.name.replace(/^.*:/, "") ||
                    course.units[1].name}{" "}
                  Quiz
                </div>
              </Link>
            </div>
          )}
          {course.units.map((unit, unitIndex) => {
            if (unitIndex > 2) return;
            return (
              <div key={unit.id} className="mt-4">
                <h2 className="text-sm font-semibold mb-2">
                  {unit?.name.replace(/^.*:/, "") || unit.name}
                </h2>
                {unit.chapters.map((chapter, chapterIndex) => {
                  if (chapterIndex > 2) return;
                  return (
                    <div
                      key={chapter.id}
                      className={cn(
                        "flex flex-row items-center justify-start p-2 pl-3",
                        {
                          "bg-stone-200 font-bold text-black rounded-lg ":
                            chapter.id === currentChapterId,
                        }
                      )}
                    >
                      {Math.floor(
                        (getCurrentChapters(0, unitIndex, chapterIndex) / 12) *
                          100
                      ) <= Math.floor(progress) &&
                        progress !== 0 && (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            style={{ color: "green" }}
                            className="h-3 w-3 mr-2"
                          />
                        )}

                      <Link
                        href={`/course/${course.id}/${unitIndex}/${chapterIndex}`}
                        className={cn("text-black text-sm ")}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="text-left">
                              {chapter?.name
                                .replace(/^.*:/, "")
                                .substring(0, 25) + "..." || chapter.name}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{chapter?.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Link>
                    </div>
                  );
                })}
                <div
                  className={cn(
                    "flex flex-row items-center justify-start p-2 pl-3",
                    {
                      "bg-stone-200 font-bold text-black rounded-lg ":
                        currentChapterId === JSON.stringify(3) &&
                        currentUnit === unitIndex &&
                        progress !== 100,
                    }
                  )}
                >
                  {Math.floor(
                    (getCurrentChapters(0, unitIndex, 3) / 12) * 100
                  ) <= Math.floor(progress) && (
                    <FontAwesomeIcon
                      icon={faPen}
                      style={{ color: "green" }}
                      className="h-3 w-3 mr-2"
                    />
                  )}
                  <Link
                    href={`/course/${course.id}/${unitIndex}/3`}
                    className={cn("text-black text-sm ")}
                  >
                    Quiz
                  </Link>
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CourseSideBar;
