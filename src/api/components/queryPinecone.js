import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";


export default async function queryPinecone (){
     // set a instance of pinecone client
     const client = new PineconeClient();
     // Initialize Pinecone
     await client.init({
       apiKey: process.env.PINECONE_API_KEY,
       environment: process.env.PINECONE_ENVIRONMENT,
     });
     // set the index name
     const pineconeIndex = client.Index(process.env.PINECONE_INDEX);
     // Search!
     // get the connection from the existing pinecone
     const vectorStore = await PineconeStore.fromExistingIndex(
       new OpenAIEmbeddings(),
       { pineconeIndex }
     );

     return vectorStore;
}
