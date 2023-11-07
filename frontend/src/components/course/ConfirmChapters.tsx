"use client";
import { Chapter, Course, Unit } from "@prisma/client";
import React, { useEffect } from "react";
import ChapterCard, { ChapterCardHandler } from "./ChapterCard";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
  // setStartCourse: any;
};

const ConfirmChapters = ({ course }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const [chapterCount, setChapterCount] = React.useState(0);
  const chapterRefs: Record<string, React.RefObject<ChapterCardHandler>> = {};
  course.units.forEach((unit) => {
    unit.chapters.forEach((chapter) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      chapterRefs[chapter.id] = React.useRef(null);
    });
  });
  const [completedChapters, setCompletedChapters] = React.useState<Set<String>>(
    new Set()
  );
  const [failedChapters, setFailedChapters] = React.useState<Set<String>>(
    new Set()
  );
  const totalChaptersCount = React.useMemo(() => {
    return course.units.reduce((acc, unit) => {
      return acc + unit.chapters.length;
    }, 0);
  }, [course.units]);

  useEffect(() => {
    // wait for 1 second before generating course
    // to allow for all the chapters to be loaded
    let count = 0;
    setTimeout(() => {
      Object.values(chapterRefs).forEach((ref) => {
        ref.current?.triggerLoad();
        count += 1;
      });
      setChapterCount(count);
    }, 1000);
  }, []);

  useEffect(() => {
    if (completedChapters.size === 9 && failedChapters.size === 0) {
      router.push(`/course/${course.id}/0/0`);
    }
  }, [
    completedChapters.size,
    totalChaptersCount,
    failedChapters.size,
    completedChapters,
    chapterCount,
    router,
    course.id,
  ]);

  return (
    <div className="w-full ">
      {course.units.map((unit, unitIndex) => {
        if (unitIndex > 2) return;
        return (
          <div key={unit.id} className="mt-2">
            {/* <h2 className="text-sm uppercase text-secondary-foreground/60 font-medium">
              Unit {unitIndex + 1}
            </h2> */}
            <h3 className="text-md font-medium">{unit.name}</h3>
            <div className="mt-1">
              {unit.chapters.map((chapter, chapterIndex) => {
                if (chapterIndex > 2) return;
                return (
                  <ChapterCard
                    completedChapters={completedChapters}
                    setCompletedChapters={setCompletedChapters}
                    setFailedChapters={setFailedChapters}
                    ref={chapterRefs[chapter.id]}
                    key={chapter.id}
                    chapter={chapter}
                    chapterIndex={chapterIndex}
                    unitId={unit.id}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      {/* <Button
        type="button"
        className="ml-4 font-semibold"
        disabled={loading}
        onClick={() => {
          setLoading(true);
          Object.values(chapterRefs).forEach((ref) => {
            ref.current?.triggerLoad();
          });
        }}
      >
        Generate
        <ChevronRight className="w-4 h-4 ml-2" strokeWidth={4} />
      </Button> */}
    </div>
  );
};

export default ConfirmChapters;
