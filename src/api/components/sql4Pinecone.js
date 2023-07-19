import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import * as dotenv from "dotenv";

dotenv.config({ path: "/Users/huayuqin/quasar-project/.env" });
/* DELETE VECTORS BY NAMESPACE IN INDEX */
(async () => {
  // create a pinecone client instance
  const client = new PineconeClient();
  // initialize the pinecone client
  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
  // connect to the pinecone index
  const index = client.Index(process.env.PINECONE_INDEX);
  const response = await index.query({
    queryRequest: {
      topK: 9999,
      vector: new Array(1536).fill(0),
      namespace: "web-2",
      includeValues: true,
    },
  });
  console.log(response);
  // delete the vectors by namespace
  console.log("Deleting vectors...");
  const deleteResponse = await response.matches.map(async (vector) => {
    await index.delete1({
      ids: [vector.id],
      namespace: "web-2",
    });
  });
  console.log(deleteResponse);
})();
