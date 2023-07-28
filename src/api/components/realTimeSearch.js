import { SerpAPILoader } from "langchain/document_loaders/web/serpapi";

export default async function realTimeSearch(query) {
  const searchMessage = query;
  const loader = new SerpAPILoader({
    q: searchMessage,
    apiKey: process.env.SERP_API_KEY,
  });

  const docs = await loader.load();

  return docs;
}
