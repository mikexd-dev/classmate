import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: Request) => {
  const prisma = new PrismaClient().$extends(withAccelerate());

  const { chatId } = await req.json();
  const _messages = await prisma.messages.findMany({
    where: {
      chatId: chatId,
    },
  });
  // console.log(_messages, "messages");
  return NextResponse.json(_messages);
};
