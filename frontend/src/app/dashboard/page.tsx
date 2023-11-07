import Navbar from "@/components/generic/Navbar";
import React from "react";
import { prisma } from "@/lib/db";
import DashboardCourseCard from "@/components/course/DashboardCourseCard";
import CreateCourseForm from "@/components/course/CreateCourseForm";
import { CourseCard } from "@/components/course/CourseCard";
import { Separator } from "@/components/ui/separator";
import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

type Props = {
  searchParams: any;
};

const DashboardPage = async (props: Props) => {
  const session = await getAuthSession();
  console.log(session, "session");
  if (!session) redirect("/");
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

  console.log(courses, "course");

  // find all userprogress of a user
  const userProgress = await prisma.userProgress.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  return (
    <div className=" min-h-screen">
      <Navbar newToken={session?.user?.token} />
      <div className="flex flex-row mt-16 pt-12 max-w-7xl mx-auto">
        <div className="flex-[1_0_0%] p-5">
          <div className="text-black font-oi text-3xl pb-5">
            Welcome <br />
            {session?.user?.name.split(" ")[0]}
          </div>
          <div className="text-black  text-sm font-light">
            View all your courses and <br />
            track your learning progress
          </div>
        </div>
        <div className="flex-[3_0_0%] p-5">
          <div className="flex flex-row w-full justify-between items-center">
            <h1 className="text-center py-2 text-xl font-semibold">Courses</h1>
            <CreateCourseForm />
          </div>

          <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
            {courses.map((item: any) => {
              // if (item.createdBy !== session?.user.id) return;
              return (
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
              );
            })}
          </div>
        </div>
      </div>
      <div className="py-8 mx-auto max-w-7xl mt-10 px-10">
        {/* <CreateCourseForm />
        <h1 className="font-bold text-center py-2">Courses</h1> */}
      </div>
    </div>
  );
};

export default DashboardPage;
