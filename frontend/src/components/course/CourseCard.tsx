import Image from "next/image";
import Link from "next/link";
import { BookOpen, YoutubeIcon } from "lucide-react";

import { IconBadge } from "./IconBadge";
// import { formatPrice } from "@/lib/format";
import { CourseProgress } from "./CourseProgress";
import { Badge } from "../ui/badge";

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
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center justify-between gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={YoutubeIcon} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
            {users > 0 && (
              <Badge className="text-center">
                {users > 1 ? `${users} learners` : `${users} learner`}{" "}
              </Badge>
            )}
          </div>
          {progress !== null ? (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
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
