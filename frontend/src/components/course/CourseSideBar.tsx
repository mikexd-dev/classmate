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

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
  currentChapterId: string;
  currentUnit: any;
};

const CourseSideBar = ({ course, currentChapterId, currentUnit }: Props) => {
  return (
    <div className="min-w-[240px] max-w-[300px] px-2 rounded-r-3xl ">
      {/* <h1 className="text-lg font-bold">{course.name}</h1> */}
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
                  {
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      style={{ color: "black" }}
                      className="h-3 w-3 mr-2"
                    />
                  }
                  <Link
                    href={`/course/${course.id}/${unitIndex}/${chapterIndex}`}
                    className={cn("text-black text-sm ")}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {chapter?.name.replace(/^.*:/, "").substring(0, 20) ||
                            chapter.name}
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
                    currentUnit === unitIndex,
                }
              )}
            >
              {
                <FontAwesomeIcon
                  icon={faPen}
                  style={{ color: "black" }}
                  className="h-3 w-3 mr-2"
                />
              }
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
    </div>
  );
};

export default CourseSideBar;
