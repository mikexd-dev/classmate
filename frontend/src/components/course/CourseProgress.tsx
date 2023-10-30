import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
  value: number;
  variant?: "default" | "success";
  size?: "default" | "sm";
}

const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

export const CourseProgress = ({
  value,
  variant,
  size,
}: CourseProgressProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Progress className="h-2 w-40" value={value} variant={variant} />
      <p className="text-xs mt-2 text-black">{Math.round(value)}% Complete</p>
    </div>
  );
};
