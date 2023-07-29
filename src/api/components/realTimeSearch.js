import { SerpAPILoader } from "langchain/document_loaders/web/serpapi";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
export default async function realTimeSearch(query) {
  const searchMessage = query;
  const loader = new SerpAPILoader({
    q: searchMessage,
    apiKey: process.env.SERP_API_KEY,
  });

  const docs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 8000
  });
  const splitDocs = await splitter.splitDocuments(docs);
  return splitDocs;
}
