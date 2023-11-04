import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(embeddings: number[]) {
  try {
    const client = new Pinecone({
      environment: process.env.PINECONE_ENV!,
      apiKey: process.env.PINECONE_API_KEY!,
    });

    const pineconeIndex = await client.index(process.env.PINECONE_INDEX!);

    // const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    const namespace = pineconeIndex.namespace(
      "uploads/16988295366382021-science-syllabus-lower-secondary.pdf"
    );
    const queryResult = await namespace.query({
      topK: 5, // return top 5 matches
      vector: embeddings,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (error) {
    console.log("Error querying embeddings:", error);
    throw error;
  }
}

export async function getContext(query: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  // 5 vectors
  return docs.join("\n").substring(0, 3000);
}
