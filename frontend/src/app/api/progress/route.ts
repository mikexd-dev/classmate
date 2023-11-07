import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import url from "url";
import { getAuthSession } from "@/lib/auth";

export async function POST(request: Request) {
  // update user address
  const session = await getAuthSession();
  if (!session?.user) {
    return new NextResponse("unauthorised", { status: 401 });
  }
  const queryParams = url.parse(request.url, true).query;
  const id: any = queryParams.id;
  const requestBody = await request.json();
  const { completed, courseId, progress } = requestBody;
  try {
    const userProgress = await prisma.userProgress.findFirst({
      where: {
        userId: session!.user?.id,
        courseId,
      },
    });

    if (!userProgress) {
      const data = await prisma.userProgress.create({
        data: {
          userId: session!.user?.id,
          courseId: courseId,
          progress: progress,
          completed: completed || false,
        },
      });
      return NextResponse.json({
        data,
      });
    } else {
      const data = await prisma.userProgress.update({
        where: {
          id: userProgress.id,
        },
        data: {
          progress: progress,
          completed: completed || false,
        },
      });
      return NextResponse.json({
        data,
      });
    }
  } catch (err) {
    const data = await prisma.userProgress.create({
      data: {
        userId: session!.user?.id,
        courseId: courseId,
        progress: progress,
        completed: completed || false,
      },
    });
    return NextResponse.json({
      data,
    });
  }
}

export async function GET(request: Request) {
  // update user address
  const session = await getAuthSession();
  if (!session?.user) {
    return new NextResponse("unauthorised", { status: 401 });
  }
  const queryParams = url.parse(request.url, true).query;
  const id: any = queryParams.courseid;
  //   const requestBody = await request.json();
  //   const { courseId } = requestBody;
  try {
    const userProgress = await prisma.userProgress.findFirst({
      where: {
        userId: session!.user?.id,
        courseId: id,
      },
    });

    return NextResponse.json({
      data: userProgress,
    });
  } catch (err) {
    return NextResponse.json({
      err,
    });
  }
}
