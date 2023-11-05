import Image from "next/image";
import Link from "next/link";
import { BookOpen, YoutubeIcon } from "lucide-react";

import { IconBadge } from "./IconBadge";
// import { formatPrice } from "@/lib/format";
import { CourseProgress } from "./CourseProgress";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  users: number;
  progress: number | null;
  category: string;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  progress,
  category,
  users,
}: CourseCardProps) => {
  return (
    <Link href={`/course/${id}/0/0`}>
      <div className="group hover:shadow-sm transition overflow-hidden  rounded-xl p-3 h-full bg-white">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-purple-600 transition line-clamp-2">
            {title.replace("Secondary School", "")}
          </div>

          <div className="flex items-center gap-x-1 text-slate-500 text-xs">
            {/* <IconBadge size="sm" icon={YoutubeIcon} /> */}
            <span>
              {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
            </span>
          </div>
          {/* <p className="text-xs text-muted-foreground">{category}</p> */}
          <div className="my-3 flex items-center justify-between gap-x-2 font-light text-xs">
            {users > 0 && (
              <Badge className="text-center">
                {users > 1 ? `${users} learners` : `${users} learner`}{" "}
              </Badge>
            )}
          </div>
          {progress !== null ? (
            // <CourseProgress
            //   variant={progress === 100 ? "success" : "default"}
            //   size="sm"
            //   value={progress}
            // />
            <div className="flex flex-row items-center justify-between">
              <div className="font-semibold text-xs">Progress</div>
              <div className="flex flex-col items-end">
                <p className="text-xs mt-2 text-black mb-1">
                  {Math.round(progress)}% completed
                </p>
                <Progress className="h-2 w-28" value={progress} />
              </div>
            </div>
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700">
              {/* {formatPrice(price)} */}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
