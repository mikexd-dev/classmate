import { Configuration, OpenAIApi } from "openai-edge";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/lib/context";
import { NextResponse } from "next/server";
import url from "url";
import { getAuthSession } from "@/lib/auth";

export const runtime = "edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  const prisma = new PrismaClient().$extends(withAccelerate());

  try {
    const {
      messages,
      chatId,
      onboardingInfo,
      prompt: promptQuiz,
    } = await req.json();

    const _chats = await prisma.chats.findMany({
      where: {
        id: chatId,
      },
    });

    if (_chats.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }

    // For injecting quiz and student's answer into chatbot
    // TODO: i created this to try the quiz prompt injection, through useComplete, they use prompt, but i think is not the right way to do it
    if (promptQuiz) {
      const prompt = {
        role: "system",
        content: `
        Student Information:
          ${onboardingInfo}
          
        You are a friendly AI learning companion. You specialize in Singapore's lower secondary school science education for students in secondary 1 and 2 (aged 13 to 14 years old).

        A student will be interacting with you to learn about Singapore's Lower Secondary School Science.

        You're to perform the following tasks:
        1. Adopt a socratic dialogue learning method.
        2. Use Theory of Mind, a concept in psychology, to understand the student's questions or responses, and thereafter: 
          a. Question their current assumptions
          b. Encourage critical-thinking and curiosity
          c. If the student's question is unclear or ambiguous, ask for more details to confirm your understanding before answering
        3. Use simple-to-understand explanations, examples and analogies to help students understand whatever they want to learn about.
        4. Always be encouraging and supportive. Offer constructive feedback on how the student can do better.
        5. Help the student learn as best as you can.
        6. When a student says he/she wants to learn something, provide a breakdown/outline and have them respond before you provide any explanations.
        7. Ensure that the content and explanations you provide are for a secondary 1 or 2 student, aged 13 to 14 years old. Having too advanced content or explanations will confuse the student.
        8. Do not answer questions that are not related to the context on Singapore's lower secondary school science syllabus.
        9. You will be provided a quiz question and the student's answer. Based on the quiz question and the student's answer perform the following steps based on 2 different scenarios:
          Scenario 1: The student's answer is correct
            a. Praise the student for getting the correct answer
            b. Ask if the student needs more explanation, if yes, provide a concise explanation
          Scenario 2: The student's answer is wrong
            a. Encourage the student and tell him/her that it's okay to get the wrong answer
            b. Prompt the student to explain why he/she chose that answer
            c. Only after the student replies why he/she chose that answer, analyze his/her explanation and reveal the correct answer, clarifying any misconceptions and explaining why the correct answer is correct for the question. Do all of these in a concise way.
            d. Ask if the student needs more explanation, if yes, provide a concise explanation
      `,
      };

      const quiz = JSON.parse(promptQuiz);

      const userMessage: any = {
        role: "user",
        content: `
        Question: ${quiz.question}, 
        My answer: ${quiz.selectedAnswer}. 
        The answer is ${quiz.isCorrect ? "correct" : "wrong"}
      `,
      };

      const response = await openai.createChatCompletion({
        // model: "gpt-3.5-turbo-16k",
        model: "gpt-4-1106-preview",
        messages: [prompt, userMessage],
        temperature: 0.8, // more creative to be more "human-like"
        stream: true,
      });

      const stream = OpenAIStream(response, {
        onStart: async () => {
          // decided to not save user message into db coz looks weird
          // await prisma.messages.create({
          //   data: {
          //     chatId,
          //     content: quiz.question,
          //     role: "user",
          //   },
          // });
        },
        onCompletion: async (completion) => {
          // save ai message into db
          await prisma.messages.create({
            data: {
              chatId,
              content: completion,
              role: "assistant",
            },
          });
        },
      });
      return new StreamingTextResponse(stream);
    } else {
      // For normal user input to chatbot
      const lastMessage = messages[messages.length - 1];
      const context = await getContext(lastMessage.content);

      const prompt = {
        role: "system",
        content: `
        Student Information:
          ${onboardingInfo}

        Context on Singapore's lower secondary school science syllabus:
          ${context}

        You are a friendly conversational AI learning companion. You specialize in assisting students aged 13 to 14 years old with Singapore's Lower Secondary School Science. Your dialogues should foster a curious and thoughtful mindset while remaining within the educational scope.

        A student will be interacting with you to learn about Singapore's Lower Secondary School Science.

        Using only the Student Onboarding Information and the Context on Singapore's lower secondary school science syllabus provided above, you're to perform the following tasks:
        1. Engage in Socratic dialogue to deepen the student's understanding.
        2. Apply Theory of Mind to assess and guide the student's learning journey:
          a. Promptly question their assumptions to inspire reflection
          b. Propel critical thinking and inquisitiveness
          c. Clarify unclear or vague questions by asking for more details
        3. Explain concepts using age-appropriate language, relatable examples, and analogies
        4. Provide constant encouragement, fostering a positive learning environment with constructive feedback
        5. Facilitate a adaptive and personalized learning experience
        6. When a student says he/she wants to learn something, provide a breakdown/outline using Singapore's lower secondary school science syllabus and have them respond before you provide any explanations
        7. Tailor content complexity to suit the understanding levels of Secondary 1 and 2 students
        8. Maintain relevance by ensuring all discussions are pertinent to the Singapore lower secondary school science syllabus

        Guidelines for Interactions:
        - If discussions veer off-topic, gently steer back to the relevant science concepts
        - Avoid jargon and high-level terminology not covered in the secondary science syllabus
        - Use metaphors and analogies that are familiar to the everyday experiences of a young teenager
      `,
      };

      /*
       *
       * Few strategies you could consider to reduce API usage and cost, reduce the number of tokens, and improve response time:
       * 1. Limit the Number of Previous Messages: Instead of sending all previous user messages, you could limit the number to the most recent ones. This would reduce the amount of data sent to the API and could improve response times.
       * 2. Summarize Previous Conversations: If the conversations are long, you could implement a summarization algorithm to condense the previous messages. This would reduce the number of tokens sent to the API.
       * 3. Selective Inclusion: If your application has a way of determining which messages are more important or relevant to the current context, you could filter the messages array to only include these messages.
       *
       **/
      const response = await openai.createChatCompletion({
        // model: "gpt-3.5-turbo-16k",
        model: "gpt-4-1106-preview",
        messages: [prompt, ...messages.slice(-10)],
        temperature: 0.1,
        stream: true,
      });

      const stream = OpenAIStream(response, {
        onStart: async () => {
          // save user message into db
          await prisma.messages.create({
            data: {
              chatId,
              content: lastMessage.content,
              role: "user",
            },
          });
        },
        onCompletion: async (completion) => {
          // save ai message into db
          await prisma.messages.create({
            data: {
              chatId,
              content: completion,
              role: "assistant",
            },
          });
        },
      });
      return new StreamingTextResponse(stream);
    }
  } catch (error) {
    console.error(error);
  }
}
