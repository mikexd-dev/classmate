import ConfirmChapters from "@/components//course/ConfirmChapters";
import Navbar from "@/components/generic/Navbar";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AnimatePresence, motion } from "framer-motion";
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
    <div
      className="min-h-screen flex justify-center items-center  "
      style={{
        backgroundImage: "url('/background-purple.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="rounded-3xl bg-violet-700 w-[652px] h-[640px] shadow-md">
        <div className="w-full h-full rounded-t-3xl backdrop-brightness-75">
          <div className="text-white font-oi text-4xl font-normal p-6">
            Course Outline...
          </div>
        </div>
        <div className="rounded-3xl bg-white absolute top-[26%] w-[652px] h-[575px] shadow-xl p-8 flex flex-col items-start justify-between">
          <div>
            <div className="font-semibold text-3xl">
              Generating your learning plan
            </div>
            <ConfirmChapters course={course} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChapters;
