import { Chroma } from "langchain/vectorstores/chroma";
import { ChromaClient } from "chromadb";

export default async function deleteDocument(userId, documentName) {
  // create a chroma client instance
  const client = new ChromaClient();

  // list all the collections

  const collections = async () => {
    return await client.listCollections();
  };

  const collection = await client.getCollection({name: userId})

  //delete the document
  await collection.delete({where: {documentName: documentName}})
  console.log("delete document successfully in Chroma")
}
