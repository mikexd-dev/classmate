"use client";
import { cn } from "@/lib/utils";
import { Chapter, Question } from "@prisma/client";
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useWindowSize } from "@/lib/useWindowSize";

type Props = {
  chapter: Chapter & {
    questions: Question[];
  };
};

const QuizCards = ({ chapter }: Props) => {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [questionState, setQuestionState] = React.useState<
    Record<string, boolean | null>
  >({});
  const { height } = useWindowSize();
  console.log(height, "height");

  const checkAnswer = React.useCallback(() => {
    const newQuestionState = { ...questionState };
    chapter?.questions?.forEach((question) => {
      const user_answer = answers[question.id];
      if (!user_answer) return;
      if (user_answer === question.answer) {
        newQuestionState[question.id] = true;
      } else {
        newQuestionState[question.id] = false;
      }
      setQuestionState(newQuestionState);
    });
  }, [answers, questionState, chapter.questions]);
  return (
    <div className={`flex-[1] ml-8 h-[${height > 700 ? 50 : 20}] `}>
      <h1 className="text-xl font-normal">Concept Check</h1>
      <div className="mt-2">
        {chapter.questions.map((question, index) => {
          const options = JSON.parse(question.options) as string[];
          if (index > 1) return;
          return (
            <div
              key={question.id}
              className={cn("p-3 mt-4 border border-secondary rounded-lg", {
                "bg-green-300": questionState[question.id] === true,
                "bg-red-300": questionState[question.id] === false,
                "bg-secondary": questionState[question.id] === null,
              })}
            >
              <h1 className="text-sm font-medium">{question.question}</h1>
              <div className="mt-2">
                <RadioGroup
                  onValueChange={(e) => {
                    setAnswers((prev) => {
                      return {
                        ...prev,
                        [question.id]: e,
                      };
                    });
                  }}
                >
                  {options.map((option, index) => {
                    return (
                      <div className="flex items-center space-x-2" key={index}>
                        <RadioGroupItem
                          value={option}
                          id={question.id + index.toString()}
                        />
                        <Label
                          htmlFor={question.id + index.toString()}
                          className="text-xs font-light"
                        >
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </div>
      <Button
        className="w-full mt-2 mt-5 font-normal bg-white text-black border border-black"
        size="sm"
        onClick={checkAnswer}
      >
        Check Answer
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default QuizCards;
