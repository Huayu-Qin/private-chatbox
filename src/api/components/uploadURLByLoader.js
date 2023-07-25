import { Document } from "langchain/document";
import { TokenTextSplitter } from "langchain/text_splitter";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import { CharacterTextSplitter } from "langchain/text_splitter";

export default async function uploadURL(url) {
  // Tool to fetch the url
  const loader = new CheerioWebBaseLoader(url);
  // const loader = new PuppeteerWebBaseLoader(url);
  const docs = await loader.load();

  console.log(docs);

  if (docs.length === 0) {
    console.log("No docs found");
    return;
  }
  // Chunk size
  const splitter = new TokenTextSplitter({
    encodingName: "gpt2",
    chunkSize: 4000,
    chunkOverlap: 200,
  });
  // const splitter = new CharacterTextSplitter({
  //   separator: " ",
  //   chunkSize: 4000,
  //   chunkOverlap: 400,
  // });

  const splitDocs = await splitter.splitDocuments(docs);

  // trim the webpage content
  const reducedDocs = splitDocs.map((doc) => {
    const reducedDoc = { ...doc };
    // console.log({ doc: doc });

    // trim the page content
    const newDocPageContent = reducedDoc.pageContent
      .replace(/['+]/g, "") //remove all the single quotes and plus signs
      // .replace(/(\s{2, }|\u00A0|&nbsp;)/g, "") //remove all the spaces and non-breaking spaces
      .replace(/\s+/g, " ")
      .replace(/(\n|\t)/g, "") //remove all the new lines and tabs and returns
      .trim(); //remove all the leading and trailing spaces
    console.log({ doc: newDocPageContent });
    return new Document({
      pageContent: newDocPageContent,
    });
  });

  // console.log(reducedDocs[0]);
  console.log(splitDocs.length);
}
