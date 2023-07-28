import { Chroma } from "langchain/vectorstores/chroma";
import { ChromaClient } from "chromadb";

// create a chroma client instance
const client = new ChromaClient();

// list all the collections

const collections = async () => {
  return await client.listCollections();
};

collections().then((res) => console.log("collections", res));

// delete the collection
const deleteCollection = async (collection) => {
  return await client.deleteCollection({ name: collection });
};

// get the details of the collection
const getCollection = async (collection) => {
  return await client.getCollection({
    name: collection,
  });
};
// (async () => {
//   await deleteCollection('userId');
//   const listOfCollections = await collections();
//   console.log(listOfCollections);
// })();

(async () => {
  const collection = await getCollection("123");
  // const listOfCollections = await collections();
  const listOfCollection = await collection.peek()
  console.log(listOfCollection);
})();
