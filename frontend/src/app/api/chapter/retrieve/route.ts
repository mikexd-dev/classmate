// /api/chapter/retrieve

import { prisma } from "@/lib/db";
import { normal_gpt, strict_output } from "@/lib/gpt";
import {
  getQuestionsFromTranscript,
  getTranscript,
  searchYoutube,
} from "@/lib/youtube";
import { NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 60;

const bodyParser = z.object({
  chapterId: z.string(),
  unitId: z.string(),
});

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { chapterId, unitId } = bodyParser.parse(body);
    console.log(unitId, "unitId");
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });
    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          error: "Chapter not found",
        },
        { status: 404 }
      );
    }

    // generate youtube and transcript
    const videoId = await searchYoutube(chapter.youtubeSearchQuery);
    let transcript = await getTranscript(videoId);
    let maxLength = 400;
    transcript = transcript.split(" ").slice(0, maxLength).join(" ");

    const summary: string = await normal_gpt(
      "You are an AI capable of summarising a youtube transcript",
      "summarise in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about, place emphasis on the key topic and concept, bold the key terms. Return the result in markdown, Create only 3 paragraphs maximum, by using '' after each paragraph, do not exceed 250 words. \n" +
        transcript,
      { summary: "summary of the transcript" }
    );

    console.log(summary, "summary");

    // generate questions
    const questions = await getQuestionsFromTranscript(
      transcript,
      chapter.name
    );

    // save the questions
    await prisma.question.createMany({
      data: questions.map((question) => {
        let options = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ];
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          chapterId: chapterId,
          unitId: unitId,
        };
      }),
    });

    // update video id and summary in chapter
    await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        videoId: videoId,
        summary: summary,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid body",
        },
        { status: 400 }
      );
    } else {
      console.log(error);
      return NextResponse.json(
        {
          success: false,
          error: error,
        },
        { status: 500 }
      );
    }
  }
}
