"use client";

import { Chapter, Unit } from "@prisma/client";
import axios from "axios";
import React from "react";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { QuizForm } from "../generic/QuizForm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../generic";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import ScoreSVG from "../../../public/score.svg";
import { proxy, useSnapshot } from "valtio";

type Props = {
  //   chapter: Chapter;
  unit: Unit;
  unitIndex: number;
  //   chapterIndex: number;
};

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

const MainQuiz = ({
  unit,
  unitIndex,
  quiz,
  setQuiz,
  quizStep,
  setQuizStep,
  wrongAnswer,
  setWrongAnswer,
  showAnswer,
  setAnswer,
}: any) => {
  //   const [quiz, setQuiz] = React.useState<any[]>([]);
  //   const [quizStep, setQuizStep] = React.useState(0);
  const [option, setOption] = React.useState<any>();
  const [progress, setProgress] = React.useState(0);
  const [correctAnswer, setCorrectAnswer] = React.useState<any[]>([]);
  //   const [wrongAnswer, setWrongAnswer] = React.useState<any[]>([]);
  //   const [showAnswer, setAnswer] = React.useState(false);
  const [score, setScore] = React.useState(-1);

  const snap = useSnapshot(state);
  React.useEffect(() => {
    async function retrieveQuestions() {
      const response = await axios.get(`/api/unit/questions?unitId=${unit.id}`);
      console.log(response.data.data, "questions");
      setQuiz(response.data.data);
    }

    retrieveQuestions();
  }, []);

  const checkAnswer = () => {
    setAnswer(true);
    const currentOption: any = quiz[quizStep];
    if (option === currentOption.answer) {
      if (correctAnswer.includes(currentOption.question)) {
        setCorrectAnswer([...correctAnswer]);
      } else {
        setCorrectAnswer([...correctAnswer, currentOption.question]);
      }
    } else {
      if (wrongAnswer.includes(currentOption.question)) {
        setWrongAnswer([...wrongAnswer]);
      } else {
        setWrongAnswer([...wrongAnswer, currentOption.question]);
      }
    }
    const obj = {
      question: currentOption.question,
      answer: currentOption.answer,
      selectedAnswer: option,
      isCorrect: option === currentOption.answer,
    };
    snap.addQuizQnAns(obj);
  };

  const nextQuestion = () => {
    checkAnswer();
    setAnswer(false);
    setQuizStep(quizStep + 1);
    setProgress(progress + 20);
  };

  const previousQuestion = () => {
    setQuizStep(quizStep - 1);
    setProgress(progress - 20);
  };

  const calculateScore = () => {
    const score = correctAnswer.length;
    checkAnswer();
    setAnswer(true);
    setScore(score);
    console.log(score, "score");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 2,
            ease: [0.5, 0.71, 1, 1.5],
            delayChildren: 0.5,
            staggerChildren: 0.5,
          },
        }}
        className="w-[540px]"
      >
        {score === -1 && quiz?.length > 0 && (
          <div className="pt-6">
            <div className="font-light text-md pb-2">
              Question {quizStep + 1} of 10
            </div>
            <div className="font-semibold text-2xl pb-2">
              {quiz[quizStep].question!}
            </div>
            <div className="pt-7"></div>

            <QuizForm
              options={quiz[quizStep].options}
              setOption={setOption}
              showAnswer={showAnswer}
              answer={quiz[quizStep].answer}
              selectedAnswer={option}
            />
          </div>
        )}
        {score !== -1 && (
          <div className="flex flex-col justify-center items-center gap-y-3">
            <Image
              src={ScoreSVG}
              height={200}
              width={240}
              alt={"buddy"}
              className="pt-7"
            />
            <div className="font-semibold text-2xl">Quiz Score</div>
            <div className="font-oi text-[60px]">{score}/10</div>
            <Button
              className="p-6 px-8 rounded-full text-xl mr-5 bg-black"
              onClick={() => {
                setQuizStep(0);
                setProgress(0);
                setCorrectAnswer([]);
                setWrongAnswer([]);
                setAnswer(false);
                setScore(-1);
              }}
            >
              Retake Quiz
            </Button>
          </div>
        )}
        {quizStep > 0 && quizStep < 9 ? (
          <div className="flex flex-row items-between justify-between w-full pt-8">
            <Button
              className="p-6 px-8 rounded-full text-xl mr-5"
              variant={"secondary"}
              onClick={() => previousQuestion()}
            >
              <ChevronLeft className="mr-2 w-6 h-6" strokeWidth={3} />
              Previous
            </Button>

            <Button
              className="p-6 px-8 rounded-full text-xl mr-5 bg-black"
              onClick={() => (showAnswer ? nextQuestion() : checkAnswer())}
            >
              {showAnswer ? "Next" : "Show Answer"}
              {showAnswer && (
                <ChevronRight className="ml-2 w-6 h-6" strokeWidth={3} />
              )}
            </Button>
          </div>
        ) : quizStep === 0 ? (
          <div className="flex flex-row items-between justify-end w-full pt-8">
            <Button
              className="p-6 px-8 rounded-full text-xl mr-5 bg-black"
              onClick={() => (showAnswer ? nextQuestion() : checkAnswer())}
            >
              {showAnswer ? "Next" : "Show Answer"}
              {showAnswer && (
                <ChevronRight className="ml-2 w-6 h-6" strokeWidth={3} />
              )}
            </Button>
          </div>
        ) : (
          score === -1 && (
            <div className="flex flex-row items-between justify-end w-full pt-8">
              <Button
                className="p-6 px-8 rounded-full text-xl mr-5 bg-black"
                onClick={() => calculateScore()}
              >
                Result
                <ChevronRight className="ml-2 w-6 h-6" strokeWidth={3} />
              </Button>
            </div>
          )
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default MainQuiz;
