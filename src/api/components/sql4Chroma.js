import { Chroma } from "langchain/vectorstores/chroma";
import { ChromaClient } from "chromadb";

// create a chroma client instance
const client = new ChromaClient();

// list all the collections

const collections = async () => {
  return await client.listCollections();
};

console.log("collections:", collections);

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
(async () => {
  await deleteCollection('website-collection-2');
  const listOfCollections = await collections();
  console.log(listOfCollections);
})();
