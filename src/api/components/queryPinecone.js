import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export default async function queryPinecone (){
     // connect to Pinecone
     const client = new PineconeClient();
     // Initialize the connection
     await client.init({
       apiKey: process.env.PINECONE_API_KEY,
       environment: process.env.PINECONE_ENVIRONMENT,
     });
     // set the index name
     const pineconeIndex = client.Index(process.env.PINECONE_INDEX);
     // get the existing index from Pinecone
     const vectorStore = await PineconeStore.fromExistingIndex(
       new OpenAIEmbeddings(),
       { pineconeIndex }
     );

     return vectorStore;
}
