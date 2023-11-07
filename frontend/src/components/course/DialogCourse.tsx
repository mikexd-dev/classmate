"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlusIcon,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Link,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib";
import { TopicsForm } from "../generic/TopicsForm";
import axios from "axios";
import { useMutation } from "wagmi";
import router from "next/navigation";
import { toast } from "../ui/use-toast";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
const subjects = [
  {
    title: "Science",
    image: "/science2.png",
  },
  {
    title: "Math",
    image: "/math.png",
  },
  {
    title: "English",
    image: "/english.png",
  },
  {
    title: "Chinese",
    image: "/chinese.png",
  },
  {
    title: "Geography",
    image: "/geography.png",
  },
  {
    title: "D&T",
    image: "/dnt.png",
  },
];

export default function DialogCourse() {
  const [showNewCourse, setShowNewCourse] = React.useState(false);
  const [subject, setSubject] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [topics, setTopics] = React.useState([]);
  const router = useRouter();
  const { mutate: createChapters, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/course/chapters", {
        title: "School " + subjects[subject].title,
        wrongAnswers: [],
      });
      return response.data;
    },
  });

  const generateCourseOutline = async () => {
    // update quiz token
    // const response = await axios.put("/api/users/token", {
    //   token: 200,
    // });
    createChapters(undefined, {
      onSuccess: ({ course }) => {
        toast({
          title: "Success",
          description: "Course created",
        });
        // return redirect(`/create/${course.id}`);
        // setGeneratingCourse(true);
        router.push(`/create/${course.id}`);
      },

      onError: (err) => {
        toast({
          title: "Error",
          description: "Error creating course" + err,
          variant: "destructive",
        });
      },
    });
  };

  const handleCourseOpen = () => {
    setShowNewCourse(true);
  };

  const handleCancelDelete = () => {
    setShowNewCourse(false);
  };

  const handleConfirmDelete = () => {
    // Perform the delete action here
    // ...
    setShowNewCourse(false);
  };

  const updateSubject = () => {
    setProgress(1);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="p-6 rounded-full text-sm mr-5 bg-purple-600 drop-shadow-md cursor-pointer"
          onClick={handleCourseOpen}
        >
          <PlusIcon className="mr-2 w-4 h-4" strokeWidth={3} />
          {/* {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} */}
          New Course
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[560px]">
        {progress === 0 ? (
          <DialogHeader>
            <DialogTitle>Select Subject</DialogTitle>
            <DialogDescription>
              Which subject would you like to learn now?
              <br />
              <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                {subjects.map((item: any, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => setSubject(index)}
                      className="flex flex-col items-center justify-center gap-y-1"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={200}
                        height={200}
                        className={cn(
                          "border-4 border-transparent p-1 hover:border-spacing-2 hover:border-purple-600 hover:border-4  hover:rounded-[25%] hover:ring-offset-2 hover:p-1 cursor-pointer",
                          {
                            "border-purple-600 border-4 rounded-[25%] p-1":
                              subject === index,
                          }
                        )}
                      />
                      <div className="text-md font-semibold">{item.title}</div>
                    </div>
                  );
                })}
              </div>
            </DialogDescription>
          </DialogHeader>
        ) : (
          <DialogHeader>
            <DialogTitle>Select Topics</DialogTitle>
            <DialogDescription>
              <TopicsForm
                setTopics={setTopics}
                topics={topics}
                fromDashboard={true}
              />
            </DialogDescription>
          </DialogHeader>
        )}

        <DialogFooter className="mt-10">
          {progress === 1 ? (
            <div className="flex flex-row items-center justify-between w-full">
              <Button
                className="p-6 px-8 rounded-full text-lg"
                variant={"secondary"}
              >
                <ChevronLeft className="mr-2 w-6 h-6" strokeWidth={3} />
                Previous
              </Button>

              <Button
                className="p-6 px-8 rounded-full text-lg"
                onClick={() => generateCourseOutline()}
                disabled={isLoading || topics.length !== 3}
              >
                {isLoading ? "Creating ..." : "Generate Course"}
                {isLoading ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <ChevronRight className="ml-2 w-6 h-6" strokeWidth={3} />
                )}
              </Button>
            </div>
          ) : (
            <Button
              className="p-6 px-8 rounded-full text-lg"
              onClick={() => updateSubject()}
              disabled={isLoading}
            >
              Next
              {isLoading ? (
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <ChevronRight className="ml-2 w-6 h-6" strokeWidth={3} />
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
