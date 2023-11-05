import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import url from "url";
import { getAuthSession } from "@/lib/auth";

export async function GET(request: Request) {
  // update user address
  const session = await getAuthSession();
  if (!session?.user) {
    return new NextResponse("unauthorised", { status: 401 });
  }
  const queryParams = url.parse(request.url, true).query;
  const id: any = queryParams.unitId;
  //   const requestBody = await request.json();
  //   const { courseId } = requestBody;
  try {
    // find all questions of a unit
    const questions: any = await prisma.question.findMany({
      where: {
        unitId: id,
      },
    });
    const questionBank: any = [];
    const newQuestion: any = [];
    const shuffled = questions.sort(() => 0.5 - Math.random());
    shuffled.map((question: any, index: number) => {
      if (index > 9) return;
      // check if question exist in newQuestion array, if not add it in
      if (!questionBank.includes(question.question)) {
        newQuestion.push(question);
        let options = JSON.parse(question.options);
        // remove the answer from options
        options = options.filter((option: string) => {
          return option !== question.answer;
        });
        question.options = {
          answer: question.answer,
          option1: options[0],
          option2: options[1],
          option3: options[2],
        };

        questionBank.push(question.question);
      }
    });

    return NextResponse.json({
      data: newQuestion,
    });
  } catch (err) {
    return NextResponse.json({
      err,
    });
  }
}
