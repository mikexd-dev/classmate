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

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
  currentChapterId: string;
};

const CourseSideBar = async ({ course, currentChapterId }: Props) => {
  return (
    <div className="max-w-[260px] p-6 rounded-r-3xl ">
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
                    {chapter?.name.replace(/^.*:/, "").substring(0, 20) ||
                      chapter.name}
                  </Link>
                </div>
              );
            })}
            <div
              className={cn(
                "flex flex-row items-center justify-start p-2 pl-3",
                {}
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
                href={`/course/${course.id}/${unitIndex}/quiz`}
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
