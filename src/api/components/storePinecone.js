import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export default async function storePinecone(reducedDocs, namespace) {
  // Connect to Pinecone
  const client = new PineconeClient();
  // Initialize the connection
  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
  // set the index name
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

  // store documents into database
  await PineconeStore.fromDocuments(reducedDocs, new OpenAIEmbeddings(), {
    pineconeIndex,
    namespace,
  });
  // storing into Pinecone take a while
  console.log("Document uploaded to Pinecone successfully");
}
