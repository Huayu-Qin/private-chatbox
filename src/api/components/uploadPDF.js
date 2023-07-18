import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import { CharacterTextSplitter } from "langchain/text_splitter";
import storePinecone from "./storePinecone.js";
import { TokenTextSplitter } from "langchain/text_splitter";

export default async function uploadPDF(path) {
  const pdfPath = path;
  const loader = new PDFLoader(pdfPath);

  const docs = await loader.load();
  console.log(docs);

  if (docs.length === 0) {
    console.log("No docs found");
    return;
  }
  // Chunk size
  const splitter = new TokenTextSplitter({
    // encodingName: "gpt2",
    chunkSize: 4000,
    chunkOverlap: 200,
  });
  // const splitter = new CharacterTextSplitter({
  //   separator: " ",
  //   chunkSize: 4000,
  //   chunkOverlap: 400,
  // });

  const splitDocs = await splitter.splitDocuments(docs);
  // Reduce the size of the metadata
  const reducedDocs = splitDocs.map((doc) => {
    const reducedMetadata = { ...doc.metadata };

    delete reducedMetadata.pdf;

    return new Document({
      pageContent: doc.pageContent,
      metadata: reducedMetadata,
    });
  });

  // console.log(reducedDocs[0]);
  console.log(splitDocs.length);
  // store into pinecone take a while
  storePinecone(reducedDocs);
}
