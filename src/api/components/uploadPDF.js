import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import { CharacterTextSplitter } from "langchain/text_splitter";
import storePinecone from "./storePinecone.js";
import { TokenTextSplitter } from "langchain/text_splitter";

export default async function uploadPDF(path, namespace) {
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
    chunkSize: 4000,
    chunkOverlap: 200,
  });
  // Split the documents into chunks
  const splitDocs = await splitter.splitDocuments(docs);
  // Reduce the size of the metadata
  const reducedDocs = splitDocs.map((doc) => {
    // Remove the pdf from the metadata
    const reducedMetadata = { ...doc.metadata };
    delete reducedMetadata.pdf;
    // Return a new document with the reduced metadata
    return new Document({
      pageContent: doc.pageContent,
      metadata: reducedMetadata,
    });
  });

  // console.log(reducedDocs[0]);
  console.log("The amount of the docs: ", splitDocs.length);
  // storing into Pinecone take a while
  storePinecone(reducedDocs, namespace + "@" + Date.now());
}
