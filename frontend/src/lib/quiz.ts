import axios from "axios";
import { strict_output } from "./gpt";

export async function getQuizFromUserData(
  grade: string,
  topics: string[]
  // course_title: string
) {
  type Question = {
    question: string;
    answer: string;
    option1: string;
    option2: string;
    option3: string;
    reasoning: string;
  };

  const questions: Question[] = await strict_output(
    "You are a very experienced teacher in the science domain, predominantly teaching secondary school science subject that may include biology, chemistry and physics, and you have question banks available and is able to generate mcq questions and answers in the given context, the length of each answer should not be more than 5 words. Generate exactly 5 sets of questions and answers, no less and no more.",
    new Array(5).fill(
      `You are to generate revision mcq questions that test fundamental concepts about the following topics (separated by comma): ${topics} with context of the the question is meant for ${grade} student. You are to create 5 sets of questions and answers with each question having 4 options and 1 correct answer and the reasoning for the correct answer. The length of each answer should not be more than 5 words. The reasoning should not be more than 20 words. `
    ),
    {
      question: "question",
      answer: "answer with max length of 5 words",
      option1: "option1 with max length of 5 words",
      option2: "option2 with max length of 5 words",
      option3: "option3 with max length of 5 words",
      reasoning: "reasoning with max length of 30 words",
    }
  );
  return questions;
}
