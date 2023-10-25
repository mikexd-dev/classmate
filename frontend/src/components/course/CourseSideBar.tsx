import { cn } from "@/lib/utils";
import { Chapter, Course, Unit } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { Separator } from "@/components/ui/separator";

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
    <div className="max-w-[230px] p-6 rounded-r-3xl bg-secondary">
      <h1 className="text-lg font-bold">{course.name}</h1>
      {course.units.map((unit, unitIndex) => {
        return (
          <div key={unit.id} className="mt-4">
            <div className="text-sm uppercase text-secondary-foreground/60">
              Unit {unitIndex + 1}
            </div>
            <h2 className="text-xs font-semibold">
              {" "}
              {unit?.name.replace(/^.*:/, "") || unit.name}
            </h2>
            {unit.chapters.map((chapter, chapterIndex) => {
              return (
                <div key={chapter.id}>
                  <Link
                    href={`/course/${course.id}/${unitIndex}/${chapterIndex}`}
                    className={cn("text-secondary-foreground/60 text-xs ", {
                      "text-green-500 font-bold leading-3":
                        chapter.id === currentChapterId,
                    })}
                  >
                    {chapter?.name.replace(/^.*:/, "") || chapter.name}
                  </Link>
                </div>
              );
            })}
            <Separator className="mt-2 text-gray-500 bg-gray-500" />
          </div>
        );
      })}
    </div>
  );
};

export default CourseSideBar;
