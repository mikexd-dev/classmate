import ConfirmChapters from "@/components//course/ConfirmChapters";
import Navbar from "@/components/generic/Navbar";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Info } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    courseId: string;
  };
};

const CreateChapters = async ({ params: { courseId } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/dashboard");
  }
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      units: {
        include: {
          chapters: true,
        },
      },
    },
  });
  if (!course) {
    return redirect("/create");
  }
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto pb-5">
        <h5 className="text-sm font-medium uppercase text-seconday-foreground/60 pt-28 ">
          Course Name
        </h5>
        <h1 className="text-5xl font-light">{course.name}</h1>

        <div className="flex p-4 mt-5 border-none bg-orange-100 text-sm rounded-xl mb-5">
          <Info className="w-10 h-10 mr-3 text-orange-400" />
          <div>
            We generated chapters for each of your units. Look over them and
            then click on "Generate" to confirm and continue.
            <br />
            <div className="font-semibold">
              Note: Generation might take a little while
            </div>
          </div>
        </div>
        <ConfirmChapters course={course} />
      </div>
    </div>
  );
};

export default CreateChapters;
