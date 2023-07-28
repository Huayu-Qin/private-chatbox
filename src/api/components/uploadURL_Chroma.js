// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import { TokenTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChromaClient } from "chromadb";
import { Chroma } from "langchain/vectorstores/chroma";

import createCrawler from "./webCrawler.js";

export default async function uploadURLs(urls, documentName, userId) {
  const webUrl = async (urls) => {
    await Promise.all(
      urls.map(async (url) => {
        /*FETCH DATA AND SPLIT DOCUMENTS  */
        const webCrawler = createCrawler([url], 10, 200);
        const pages = await webCrawler.startCrawl();

        // Truncate the page content through the byte size
        const truncatedPages = (str, bytes) => {
          // encoder
          const enc = new TextEncoder();
          // return the string by decoding
          return new TextDecoder("utf-8").decode(
            enc.encode(str).slice(0, bytes)
          );
        };

        // build Document from the pages, format is [[{doc1}],[doc2]]
        const docs = await Promise.all(
          pages.map(async (page) => {
            // build a splitter instance
            const splitter = new TokenTextSplitter({
              encodingName: "gpt2",
              chunkSize: 1000, //4000
              chunkOverlap: 20, //200
            });
            // split the page content into tokens
            const splitDocs = await splitter.splitDocuments([
              new Document({
                pageContent: page.text,
                metadata: {
                  url: page.url,
                  text: truncatedPages(page.text, 36000),
                  userId: userId,
                  documentName: documentName,
                },
              }),
            ]);

            return splitDocs;
          })
        );

        // convert the docs into a single array
        const docsArray = docs.flat();
        console.log(docsArray[0]);
        console.log("total docs:", docsArray.length);

        /* STEP TWO: STORE INTO CHROMA */
        // connect to the Chroma
        const client = new ChromaClient();


        // delete a existing collection
        // await client.deleteCollection({
          //   name: "website-collection",
          // });

          // store the documents into the Chroma
          console.log("Storing documents...");
          await Chroma.fromDocuments(
            docsArray,
            new OpenAIEmbeddings({
              apiKey: process.env.OPENAI_API_KEY,
              modelName: "text-embedding-ada-002",
            }),
            { collectionName: userId }
            );
            // list all the collections
            const collections = await client.listCollections();
            console.log("collections:", collections);
          })
          );
  };
  await webUrl(urls);
}
