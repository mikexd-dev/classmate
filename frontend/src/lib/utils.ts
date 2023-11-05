import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { proxy } from "valtio";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToAscii(inputString: string) {
  // remove non ascii characters
  const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
  return asciiString;
}
export const state = proxy({
  count: 0,
  unusedCount: 0,
  quizQnAns: {},
  addQuizQnAns: (n: any) => {
    state.quizQnAns = n;
  },
  add: (n: number) => {
    state.count += n;
  },
});
