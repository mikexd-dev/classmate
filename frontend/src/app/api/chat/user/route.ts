// /api/course/createChapters

import { NextResponse } from "next/server";
import { createChaptersSchema } from "@/lib/validators";
import { ZodError } from "zod";
import { strict_output } from "@/lib/gpt";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { getUnsplashImage } from "@/lib/unsplash";
import { uploadJson } from "@/lib/s3";
import { generateImagePrompt, generateImage } from "@/lib/openai";
import { searchYoutube } from "@/lib/youtube";
import url from "url";
// import { checkSubscription } from "@/lib/subscription";

export const maxDuration = 60;

export async function GET(req: Request, res: Response) {
  const session = await getAuthSession();
  // const queryParams = url.parse(req.url, true).query;
  // const courseId: any = queryParams.id;

  const chat = await prisma.chats.findFirst({
    where: {
      userId: session!.user?.id,
    },
  });

  return NextResponse.json(chat);
}
