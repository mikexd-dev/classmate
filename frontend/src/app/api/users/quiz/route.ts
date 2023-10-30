import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import url from "url";
import { NextResponse } from "next/server";
import { getQuizFromUserData } from "@/lib/quiz";

export async function GET(request: Request) {
  // update user address
  const session = await getAuthSession();
  if (!session?.user) {
    return new NextResponse("unauthorised", { status: 401 });
  }

  // const requestBody = await request.json();

  const quiz = await getQuizFromUserData(
    session?.user?.grade,
    session?.user?.topics
  );

  // console.log(session, walletAddress, "id, walletAddress");
  // const data = await prisma.user.update({
  //   where: {
  //     id: session?.user?.id,
  //   },
  //   data: {
  //     onBoardingQuiz: quiz,
  //   },
  // });
  return NextResponse.json({
    data: quiz,
  });
}

export async function PUT(request: Request) {
  // update user address
  const session = await getAuthSession();
  if (!session?.user) {
    return new NextResponse("unauthorised", { status: 401 });
  }

  const requestBody = await request.json();
  const quiz = requestBody.quiz;

  const data = await prisma.user.update({
    where: {
      id: session?.user?.id,
    },
    data: {
      onBoardingQuiz: quiz,
    },
  });
  return NextResponse.json({
    data,
  });
}
