// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import storePinecone from "./storePinecone.js";
import createCrawler from "./webCrawler.js";
import { TokenTextSplitter } from "langchain/text_splitter";
import docSplitter from "./docSplitter.js";

export default async function uploadURLs(urls) {
  const webUrl = async (urls) => {
    await Promise.all(
      urls.map(async (url) => {
        /* OPTION ONE: USE TOOL PROVIDED BY LANGCHAIN TO FETCH URL AND SPLITTED */

        // const loader = new CheerioWebBaseLoader(url);
        // // const loader = new PuppeteerWebBaseLoader(url);
        // const docs = await loader.load();

        // console.log(docs);
        // // console.log(docs);
        // if (docs.length === 0) {
        //   console.log("No docs found");
        //   return;
        // }
        // // Chunk size
        // // try to use the token splitter
        // const splitter = new TokenTextSplitter({
        //   chunkSize: 4000,
        //   chunkOverlap: 200,
        // });
        // // const splitter = new CharacterTextSplitter({
        // //   separator: " ",
        // //   chunkSize: 4000,
        // //   chunkOverlap: 400,
        // // });

        // const splitDocs = await splitter.splitDocuments(docs);
        // // console.log(splitDocs[0]);
        // // trim the webpage content
        // const reducedDocs = splitDocs.map((doc) => {
        //   const reducedDoc = { ...doc };
        //   // console.log({ doc: doc });

        //   //trim the page content
        //   const newDocPageContent = reducedDoc.pageContent
        //     .replace(/['+]/g, "") //remove all the single quotes and plus signs
        //     // .replace(/(\s{2, }|\u00A0|&nbsp;)/g, "") //remove all the spaces and non-breaking spaces
        //     .replace(/\s+/g, " ")
        //     .replace(/(\n|\t)/g, "") //remove all the new lines and tabs and returns
        //     .trim(); //remove all the leading and trailing spaces
        //   console.log({ doc: newDocPageContent });
        //   return new Document({
        //     pageContent: newDocPageContent,
        //   });
        // });

        // // console.log(reducedDocs[0]);
        // console.log(splitDocs.length);

        // // store into pinecone take a while
        // storePinecone(reducedDocs);

        /* OPTION TWO: USE TOOL BY NODE-SPIDER TO FETCH URL AND SPLITTED */
        const reducedDocs = await docSplitter(url);
        // store into pinecone
        await storePinecone(reducedDocs);
      })
    );
  };
  await webUrl(urls);
}
