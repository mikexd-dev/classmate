// /api/get-messages
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
  return NextResponse.json(_messages);
};

export async function PUT(req: Request) {
  const prisma = new PrismaClient().$extends(withAccelerate());

  try {
    const { chatId, content, role } = await req.json();

    const data = await prisma.messages.create({
      data: {
        chatId,
        content,
        role,
      },
    });

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.log(error);
  }
}
