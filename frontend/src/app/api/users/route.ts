import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import url from "url";
import { getAuthSession } from "@/lib/auth";

export async function POST(request: Request) {
  // update user address
  const session = await getAuthSession();
  console.log(session, "session wtf");
  if (!session?.user) {
    return new NextResponse("unauthorised", { status: 401 });
  }
  const queryParams = url.parse(request.url, true).query;
  const id: any = queryParams.id;
  const requestBody = await request.json();
  const walletAddress = requestBody.walletAddress;

  // console.log(session, walletAddress, "id, walletAddress");

  const chat = await prisma.chats.findFirst({
    where: { userId: session?.user?.id },
  });

  console.log();

  // if no chat, create chat - required, otherwise chat will be created twice
  if (!chat) {
    await prisma.chats.create({
      data: {
        userId: session?.user?.id,
      },
    });
  }

  const data = await prisma.user.update({
    where: {
      id: session?.user?.id,
    },
    data: {
      address: walletAddress,
    },
  });

  return NextResponse.json({
    data,
  });
}

export async function PUT(request: Request) {
  // update user address
  const session = await getAuthSession();
  console.log(session, "session wtf");
  if (!session?.user) {
    return new NextResponse("unauthorised", { status: 401 });
  }
  const queryParams = url.parse(request.url, true).query;
  const id: any = queryParams.id;
  const requestBody = await request.json();
  const tokenProfileId = requestBody.tokenProfileId;

  // console.log(session, walletAddress, "id, walletAddress");
  const data = await prisma.user.update({
    where: {
      id: session?.user?.id,
    },
    data: {
      tokenProfileId,
    },
  });
  return NextResponse.json({
    data,
  });
}
