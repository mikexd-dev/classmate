"use client";

import { Chapter, Course, Unit } from "@prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Progress } from "../ui/progress";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
};

const DashboardCourseCard = ({ course }: Props) => {
  return (
    <div>
      <Card className="w-full h-66">
        <CardHeader className="p-0">
          <Link
            href={`/course/${course.id}/0/0`}
            className="relative block w-fit"
          >
            <Image
              src={course.image || ""}
              className="object-cover w-full h-[200px] rounded-t-lg"
              width={300}
              height={300}
              alt="picture of the course"
            />
            <span className="absolute px-2 py-1 text-white rounded-md bg-black/60 w-fit bottom-2 left-2 right-2">
              {course.name}
            </span>
          </Link>
        </CardHeader>
        <CardContent className="pt-2">
          {course.units.map((unit, unitIndex) => {
            if (unitIndex > 2) return;
            return (
              <Link
                href={`/course/${course.id}/${unitIndex}/0`}
                key={unit.id}
                className="block underline w-fit"
              >
                <div className="flex justify-between cursor-pointer hover:underline dark:text-white text-left  whitespace-nowrap">
                  <div> {unit.name.substring(0, 25)}</div>
                  <ArrowRight className="h-4 w-4 dark:text-white" />
                </div>
              </Link>
            );
          })}
        </CardContent>
        <CardFooter className="pt-2">
          <Progress value={33} className="w-full h-2" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardCourseCard;
