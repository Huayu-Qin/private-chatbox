import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export default async function storePinecone(reducedDocs) {
  /** STEP TWO: UPLOAD TO DATABASE */
  // Connect to Pinecone
  const client = new PineconeClient();
  // Initialize the client

  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
  // set the index name
  // console.log(process.env.PINECONE_INDEX);
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

  // create a store from the documents
  await PineconeStore.fromDocuments(reducedDocs, new OpenAIEmbeddings(), {
    pineconeIndex,
    // namespace: "langchain",
  });
  // store into pinecone take a while
  console.log("Document uploaded to Pinecone successfully");
}
