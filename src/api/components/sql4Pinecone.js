import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import * as dotenv from "dotenv";

dotenv.config({ path: "/Users/huayuqin/quasar-project/.env" });

const connectPinecone = async () => {
  // create a pinecone client instance
  const client = new PineconeClient();
  // initialize the pinecone client
  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
  return client;
};

/* DELETE VECTORS BY NAMESPACE IN INDEX */
const deleteData = async (namespace) => {
  // connect to Pinecone
  const client = await connectPinecone();
  // connect to the pinecone index
  const index = client.Index(process.env.PINECONE_INDEX);
  // query the vectors by namespace
  const response = await index.query({
    queryRequest: {
      topK: 9999,
      vector: new Array(1536).fill(0),
      namespace,
      includeValues: true,
    },
  });
  console.log(response);
  // delete the vectors by namespace and id
  console.log("Deleting vectors...");
  const deleteResponse = await response.matches.map(async (vector) => {
    await index.delete1({
      ids: [vector.id],
      namespace,
    });
  });
  console.log(deleteResponse);
};

const createIndex = async () => {
  //connect to Pinecone
  const client = await connectPinecone();
  // create a new index
  const response = await client.createIndex({
    createRequest: {
      name: "test",
      dimension: 1536,
      metric: "cosine",
    },
  });
  console.log(response);
};
deleteData('test')
// createIndex();
