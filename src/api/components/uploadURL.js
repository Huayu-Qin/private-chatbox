import { Document } from "langchain/document";
import storePinecone from "./storePinecone.js";
import docSplitter from "./docSplitter.js";

export default async function uploadURLs(urls) {
  const webUrl = async (urls) => {
    await Promise.all(
      urls.map(async (url) => {
        if (url.length === 0) {
          console.log("No URL found");
          return;
        }
        /* USE TOOL BY NODE-SPIDER TO FETCH URL AND SPLITTED */
        const reducedDocs = await docSplitter(url);
        //trim the page content
        const newReducedDocs = reducedDocs.map((doc) => {
          const newDoc = { ...doc };
          newDoc.pageContent
            // .replace(/['+]/g, "") //remove all the single quotes and plus signs
            // .replace(/(\s{2, }|\u00A0|&nbsp;)/g, "") //remove all the spaces and non-breaking spaces
            .replace(/(\n|\t)/g, " ") //remove all the new lines and tabs and returns
            .replace(/\s+/g, " ")
            .trim(); //remove all the leading and trailing spaces
          newDoc.metadata.text
            // .replace(/['+]/g, "") //remove all the single quotes and plus signs
            // .replace(/(\s{2, }|\u00A0|&nbsp;)/g, "") //remove all the spaces and non-breaking spaces
            .replace(/(\n|\t)/g, " ") //remove all the new lines and tabs and returns
            .replace(/\s+/g, " ")
            .trim(); //remove all the leading and trailing spaces
          console.log({ doc: newDoc });
          return new Document({
            pageContent: newDoc.pageContent,
            metadata: {
              url: newDoc.metadata.url,
              text: newDoc.metadata.text,
            },
          });
        });
        // store data into Pinecone
        await storePinecone(newReducedDocs, "test4");
      })
    );
  };
  await webUrl(urls);
}
