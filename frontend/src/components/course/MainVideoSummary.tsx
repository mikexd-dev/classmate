import { Chapter, Unit } from "@prisma/client";
import React from "react";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";

type Props = {
  chapter: Chapter;
  unit: Unit;
  unitIndex: number;
  chapterIndex: number;
};

const MainVideoSummary = ({
  unit,
  unitIndex,
  chapter,
  chapterIndex,
}: Props) => {
  const newSummary = chapter?.summary?.replace(/\n/gi, "\n\n\n");
  return (
    <div className="min-w-[640px]">
      {/* <h4 className="text-sm uppercase text-secondary-foreground/60">
        Unit {unitIndex + 1} &bull; Chapter {chapterIndex + 1}
      </h4> */}
      {/* <h1 className="text-2xl font-light">{chapter.name}</h1> */}
      <iframe
        title="chapter video"
        className="w-full mt-4 aspect-video max-h-[24rem] rounded-3xl drop-shadow-md"
        src={`https://www.youtube.com/embed/${chapter.videoId}`}
        allowFullScreen
      />
      <div className="mt-8">
        <h3 className="text-2xl font-medium">🥥 In a Nutshell</h3>
        <p className="mt-2 text-secondary-foreground/80 text-base ">
          <Markdown
            className={"h-72 overflow-y-auto"}
            remarkPlugins={[remarkBreaks]}
            children={chapter?.summary?.replace(/\n/gi, "&nbsp; \n")}
          />
          {/* {newSummary}
          </Markdown> */}
        </p>
      </div>
    </div>
  );
};

export default MainVideoSummary;
