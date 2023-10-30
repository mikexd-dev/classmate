"use client";

import { cn } from "@/lib";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useToast } from "../ui/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faCheckCircle,
  faCircleXmark,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

type Props = {
  chapter: Chapter;
  chapterIndex: number;
  unitId: string;
  completedChapters: Set<String>;
  setCompletedChapters: React.Dispatch<React.SetStateAction<Set<String>>>;
};

export type ChapterCardHandler = {
  triggerLoad: () => void;
};

const ChapterCard = React.forwardRef<ChapterCardHandler, Props>(
  (
    { chapter, chapterIndex, setCompletedChapters, completedChapters, unitId },
    ref
  ) => {
    const { toast } = useToast();
    const [success, setSuccess] = React.useState<boolean | null>(null);

    const { mutate: retrieveChapter, isLoading } = useMutation({
      mutationFn: async (data) => {
        try {
          const response = await axios.post("/api/chapter/retrieve", {
            chapterId: chapter.id,
            unitId,
          });
          return response.data;
        } catch (e: any) {
          console.log(e, "error");
          setSuccess(false);
          throw new Error(e);
        }
      },
    });

    const addChapterIdToSet = React.useCallback(() => {
      setCompletedChapters((prev) => {
        const newSet = new Set(prev);
        newSet.add(chapter.id);
        return newSet;
      });
    }, [chapter.id, setCompletedChapters]);

    React.useEffect(() => {
      if (chapter.videoId) {
        setSuccess(true);
        addChapterIdToSet();
      }
    }, [chapter]);

    React.useImperativeHandle(ref, () => ({
      async triggerLoad() {
        if (chapter.videoId) {
          addChapterIdToSet();
          return;
        }
        retrieveChapter(undefined, {
          onSuccess: () => {
            setSuccess(true);
            addChapterIdToSet();
          },
          onError: () => {
            console.log("error");
            setSuccess(false);
            toast({
              title: "Error",
              description: "There was an error loading your chapter",
              variant: "destructive",
            });
            addChapterIdToSet();
          },
        });
      },
    }));

    return (
      <div
        key={chapterIndex}
        className={cn("px-4 pt-2 rounded flex justify-start items-center", {})}
      >
        {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
        {!isLoading && success && (
          <FontAwesomeIcon icon={faCheckCircle} style={{ color: "#16a34a" }} />
        )}
        {!isLoading && success === false && (
          <FontAwesomeIcon icon={faCircleXmark} style={{ color: "#cc3524" }} />
        )}
        <h5 className="font-light pl-3">{chapter.name}</h5>
        {!isLoading && !success && (
          <FontAwesomeIcon
            icon={faRotateRight}
            className="pl-2"
            style={{ color: "grey", cursor: "pointer" }}
            onClick={() => retrieveChapter()}
          />
        )}
      </div>
    );
  }
);

ChapterCard.displayName = "ChapterCard";

export default ChapterCard;
