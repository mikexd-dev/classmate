import { NextResponse } from "next/server";
import { createChaptersSchema } from "@/lib/validators";
import { ZodError } from "zod";
import { strict_output } from "@/lib/gpt";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { getUnsplashImage } from "@/lib/unsplash";
import { checkFileExist, uploadJson, uploadVoice } from "@/lib/s3";
import { generateImagePrompt, generateImage } from "@/lib/openai";
import { searchYoutube } from "@/lib/youtube";
import url from "url";
import axios from "axios";
// import { checkSubscription } from "@/lib/subscription";
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();
export const maxDuration = 60;

export async function POST(req: Request, res: Response) {
  const { message, chatId, messageId } = await req.json();

  try {
    await checkFileExist(chatId, messageId);
    return NextResponse.json({
      voice: `https://aiclassmate.s3.ap-southeast-1.amazonaws.com/voice/${chatId}/${messageId}.mp3`,
    });
  } catch (err) {
    console.log(err, "err");
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      input: message,
      voice: "alloy",
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await uploadVoice(buffer, chatId, messageId);
    return NextResponse.json({
      voice: `https://aiclassmate.s3.ap-southeast-1.amazonaws.com/voice/${chatId}/${messageId}.mp3`,
    });
  }

  //   console.log(keyExist, "keyExist");

  //   const mp3 = await openai.audio.speech.create({
  //     model: "tts-1",
  //     input: message,
  //     voice: "alloy",
  //   });

  //   const buffer = Buffer.from(await mp3.arrayBuffer());
  //   await uploadVoice(buffer, chatId, messageId);

  // Get the generated audio data as an ArrayBuffer
  //   const audioData = await response.arrayBuffer();

  // Check if the HTTP response is not successful
  //   if (!response.ok) {
  //     throw new Error("Request failed");
  //   }

  // Create an HTTP response with the generated audio data
  //   return new Response(buffer, {
  //     headers: {
  //       "Content-Type": "audio/mp3", // Adjust the content type based on the actual audio format
  //     },
  //   });

  // return NextResponse.json({ voice: response.data });
}
