import { Configuration, OpenAIApi } from "openai-edge";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/lib/context";
import { NextResponse } from "next/server";

export const runtime = "edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  const prisma = new PrismaClient().$extends(withAccelerate());

  try {
    const { messages, chatId } = await req.json();
    const _chats = await prisma.chats.findMany({
      where: {
        id: chatId,
      },
    });
    console.log("chat la ->>>>", _chats);
    if (_chats.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }

    // hard coded for now
    // TODO: get onboarding info from mike's part
    const onboardingInfo = `
      Student's name: Terry
      Student's grade: Secondary 2 (Express stream)
      Skill analysis: 
        Strengths:
          - Adaptations
          - Life cycles
          - Reproduction

        Weaknesses:
          - Respiration
          - Photosynthesis
    `;

    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content);

    console.log("lastMessage -> ", lastMessage);
    // console.log("context -> ", context);

    const prompt = {
      role: "system",
      content: `
        Student Onboarding Information:
          ${onboardingInfo}

        Context on Singapore's lower secondary school science syllabus:
          ${context}

        You are a friendly conversational AI learning companion. You specialize in Singapore's lower secondary school science education for students in secondary 1 and 2 (aged 13 to 14 years old).

        A student will be interacting with you to learn about Singapore's Lower Secondary School Science.

        Using only the Student Onboarding Information and the Context on Singapore's lower secondary school science syllabus provided above, you're to perform the following tasks:
        1. Adopt a socratic dialogue learning method.
        2. Use Theory of Mind, a concept in psychology, to understand the student's questions or responses, and thereafter: 
          a. Question their current assumptions
          b. Encourage critical-thinking and curiosity
          c. If the student's question is unclear or ambiguous, ask for more details to confirm your understanding before answering
        3. Use simple-to-understand explanations, examples and analogies to help students understand whatever they want to learn about.
        4. Always be encouraging and supportive. Offer constructive feedback on how the student can do better.
        5. Help the student learn as best as you can.
        6. When a student says he/she wants to learn something, provide a breakdown/outline and have them response before you provide any explanations.
        7. Ensure that the content and explanations you provide are for a secondary 1 or 2 student, aged 13 to 14 years old. Having too advanced content or explanations will confuse the student.
        8. Do not answer questions that are not related to the context on Singapore's lower secondary school science syllabus.
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

    // console.log("prompt -> ", prompt);
    // console.log("messages -> ", messages.slice(-5));

    const response = await openai.createChatCompletion({
      // model: "gpt-3.5-turbo-16k",
      model: "gpt-4",
      messages: [prompt, ...messages.slice(-5)],
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
  } catch (error) {
    console.error(error);
  }
}
