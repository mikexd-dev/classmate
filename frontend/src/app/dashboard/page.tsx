import Navbar from "@/components/generic/Navbar";
import React from "react";
import { prisma } from "@/lib/db";
import DashboardCourseCard from "@/components/course/DashboardCourseCard";
import CreateCourseForm from "@/components/course/CreateCourseForm";
import { CourseCard } from "@/components/course/CourseCard";
import { Separator } from "@/components/ui/separator";
import { getAuthSession } from "@/lib/auth";
import Image from "next/image";

type Props = {
  searchParams: any;
};

const DashboardPage = async (props: Props) => {
  const session = await getAuthSession();

  const courses = await prisma.course.findMany({
    include: {
      units: {
        include: { chapters: true },
      },
      users: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // find all userprogress of a user
  const userProgress = await prisma.userProgress.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  return (
    <div>
      <Navbar />
      <div className="py-8 mx-auto max-w-7xl mt-10 px-10">
        <CreateCourseForm />
        <h1 className="font-bold text-center py-2">Courses</h1>
        <Separator className="flex-[1] mb-5" />
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
          {courses.map((item: any) =>
            item.courseTokenId < 3 || item.courseTokenId === 6 ? (
              <></>
            ) : (
              // check if userprogress course includes course id
              // if it does, then show the progress
              // else show 0
              <CourseCard
                key={item.id}
                id={item.id}
                title={item.name}
                imageUrl={item.image!}
                chaptersLength={item.units.length}
                users={item.users.length!}
                progress={
                  userProgress.find((up) => up.courseId === item.id)
                    ? userProgress.find((up) => up.courseId === item.id)
                        ?.progress!
                    : 0
                }
                category={"category"}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
