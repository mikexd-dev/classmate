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
  // const body = await req.json();
  const queryParams = url.parse(req.url, true).query;
  const courseId: any = queryParams.id;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      units: {
        include: {
          chapters: {
            include: { questions: true },
          },
        },
      },
    },
  });

  return NextResponse.json(course);
}

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    // if (!session?.user) {
    //   return new NextResponse("unauthorised", { status: 401 });
    // }
    // const isPro = await checkSubscription();
    // if (session.user.credits <= 0 && !isPro) {
    //   return new NextResponse("no credits", { status: 402 });
    // }

    const body = await req.json();
    const { title: basic_title, wrongAnswers } = body;
    const title = session?.user?.grade + " " + basic_title;

    type outputUnits = {
      title: string;
      chapters: {
        youtube_search_query: string;
        chapter_title: string;
      }[];
    }[];

    type nftCourse = {
      name: string;
      description: string;
      image?: string;
      attributes: {
        trait_type: string;
        value: string;
      }[];
    };

    let units: any = await strict_output(
      `You are a very experienced teacher in the science domain, predominantly teaching secondary school science subject that may include biology, chemistry and physics in the singapore secondary school education curriculum. You are capable of curating course content, coming up with relevant units titles, when given a course title of a ${
        session?.user?.grade
      } student. The student wishes to learn the following topics (separated by comma): ${JSON.stringify(
        session?.user?.topics
      )}. There was a revision quiz given on the topics and here are the questions that student has gotten wrong (separated by comma): ${JSON.stringify(
        wrongAnswers
      )}. These could be the topics that the student is weak in. Please generate 3 units of object, return the result in an array. Here is an example of a json output: 
       [{"unit": 'unit name'},
        {"unit": 'unit name'},
        {"unit": 'unit name'}]`,
      new Array(3).fill(
        `It is your job to create a unit about ${title} of a ${
          session?.user?.grade
        } student. The student wishes to learn the following topics (separated by comma): ${JSON.stringify(
          session?.user?.topics
        )}. `
      ),
      {
        unit: "title of the unit",
      }
    );

    // only take the first 3 units
    units = units.slice(0, 3);

    let output_units: outputUnits = await strict_output(
      `You are an AI capable of curating course content of a ${
        session?.user?.grade
      } student. The student wishes to learn the following topics (separated by comma): ${JSON.stringify(
        session?.user?.topics
      )}. There was a revision quiz given on the topics and here are the questions that student has gotten wrong (separated by comma): ${JSON.stringify(
        wrongAnswers
      )}. These could be the topics that the student is weak in., coming up with relevant chapter titles, and finding relevant youtube videos for each chapter. Please generate 3 chapters of object, return the result in an array.Here is an example of a json output: 
       [{"title":"Energy forms","chapters":[{"chapter_title":"Forms of Energy explained","youtube_search_query":"Introduction to Forms of Energy"},{"chapter_title":"Renewable and Non-Renewable Energy Sources","youtube_search_query":"Renewable vs Non-Renewable Energy Sources"},{"chapter_title":"Energy Conversion and Efficiency","youtube_search_query":"Energy Conversion and Efficiency"}]},
       {"title":"Energy forms","chapters":[{"chapter_title":"Forms of Energy explained","youtube_search_query":"Introduction to Forms of Energy"},{"chapter_title":"Renewable and Non-Renewable Energy Sources","youtube_search_query":"Renewable vs Non-Renewable Energy Sources"},{"chapter_title":"Energy Conversion and Efficiency","youtube_search_query":"Energy Conversion and Efficiency"}]},
       {"title":"Energy forms","chapters":[{"chapter_title":"Forms of Energy explained","youtube_search_query":"Introduction to Forms of Energy"},{"chapter_title":"Renewable and Non-Renewable Energy Sources","youtube_search_query":"Renewable vs Non-Renewable Energy Sources"},{"chapter_title":"Energy Conversion and Efficiency","youtube_search_query":"Energy Conversion and Efficiency"}]}]`,
      new Array(3).fill(
        `The user has requested to create chapters for each of the units. Then, for each chapter, provide a detailed youtube search query that can be used to find an informative educational video for each chapter. Each query should give an educational informative course in youtube with the context of secondary school science courses such as O level examination topics in sciences (physics, biology, chemistry). `
      ),
      {
        title: "title of the unit",
        chapters:
          "an array of chapters, each chapter should have a youtube_search_query and a chapter_title key in the JSON object",
      }
    );

    // only take the first 3 chapters of each unit
    output_units = output_units.map((unit) => {
      return {
        title: unit.title,
        chapters: unit.chapters.slice(0, 3),
      };
    });

    // const imageSearchTerm = await strict_output(
    //   "you are an AI capable of finding the most relevant image for a course",
    //   `Please provide a good image search term for the title of a course about ${title}. This search term will be fed into the Youtube API to fetch the youtube thumbnail, so make sure it is a good search term that will return good results.`,
    //   {
    //     image_search_term: "a good search term for the title of the course",
    //   }
    // );

    // const image_description = await generateImagePrompt(title);
    // const course_image: any = await generateImage(image_description);

    const videoId = await searchYoutube(
      output_units[0].chapters[0].youtube_search_query
    );
    const course_image = `http://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    // const course_image = await getUnsplashImage(
    //   imageSearchTerm.image_search_term
    // );

    // upload image and details of course to s3
    let nftDescription: nftCourse = await strict_output(
      "you are an AI capable of creating a very short description and course attributes of NFT course given a title.",
      `It is your job to create a short course description and course attributes about ${title} and the units it contains: ${JSON.stringify(
        units
      )}`,
      {
        name: title,
        description:
          "a short description of the course, it should be less than 100 characters",
        attributes:
          "an array of attributes, each attribute should have a trait_type and a value key in the JSON object",
      }
    );

    // save in db

    // retrieve the biggest courseTokenId and increment it by 1
    const lastcourse = await prisma.course.findFirst({
      orderBy: {
        courseTokenId: "desc",
      },
    });

    const course = await prisma.course.create({
      data: {
        name: title,
        image: course_image,
        courseTokenId: lastcourse ? lastcourse?.courseTokenId! + 1 : 0,
        createdBy: session?.user.id,
      },
    });

    nftDescription.image = course_image;
    const result = await uploadJson(
      nftDescription,
      lastcourse ? (lastcourse?.courseTokenId! + 1).toString()! : "0"
    );

    for (const unit of output_units) {
      const title = unit.title;
      const prismaUnit = await prisma.unit.create({
        data: {
          name: title,
          courseId: course.id,
        },
      });
      await prisma.chapter.createMany({
        data: unit.chapters.map((chapter) => {
          return {
            name: chapter.chapter_title,
            youtubeSearchQuery: chapter.youtube_search_query,
            unitId: prismaUnit.id,
          };
        }),
      });
    }

    const courseDetail = await prisma.course.findUnique({
      where: {
        id: course.id,
      },
      include: {
        units: {
          include: {
            chapters: true,
          },
        },
      },
    });

    return NextResponse.json({
      course: courseDetail,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("invalid body", { status: 400 });
    }
    console.error(error);
    return new NextResponse("invalid body", { status: 500 });
  }
}
