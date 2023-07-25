import { Document } from "langchain/document";
import { TokenTextSplitter } from "langchain/text_splitter";
import createCrawler from "./webCrawler.js";

export default async function docSplitter(url) {
  const webCrawler = createCrawler([url], 10, 200);
  const pages = await webCrawler.startCrawl();

  // Truncate the page content through the byte size
  const truncatedPages = (str, bytes) => {
    // encoder
    const enc = new TextEncoder();
    // return the string by decoding
    return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
  };
  // build Document from the pages, format is [[{doc1}],[doc2]]
  const docs = await Promise.all(
    pages.map(async (page) => {
      // build a splitter instance
      const splitter = new TokenTextSplitter({
        encodingName: "gpt2",
        chunkSize: 1000, //3000
        chunkOverlap: 20, //200
      });
      // split the page content into tokens
      const splitDocs = await splitter.splitDocuments([
        new Document({
          pageContent: page.text,
          metadata: {
            url: page.url,
            text: truncatedPages(page.text, 36000),
          },
        }),
      ]);

      return splitDocs;
    })
  );

  // convert the docs into a single array
  const docsArray = docs.flat();

  return docsArray;
}
