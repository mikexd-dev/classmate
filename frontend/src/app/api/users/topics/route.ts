import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import url from "url";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  // update user address
  const session = await getAuthSession();
  if (!session?.user) {
    return new NextResponse("unauthorised", { status: 401 });
  }

  const requestBody = await request.json();
  const topics = requestBody.topics;
  const quiz = requestBody.quiz;

  // console.log(session, walletAddress, "id, walletAddress");
  const data = await prisma.user.update({
    where: {
      id: session?.user?.id,
    },
    data: {
      topics,
      onBoardingQuiz: quiz,
    },
  });
  return NextResponse.json({
    data,
  });
}
