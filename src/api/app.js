import express from "express";

// query the database and return the answer
import { VectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import bodyParser from "body-parser";

// cross origin resource sharing
import cors from "cors";
import * as dotenv from "dotenv";

// import components
import uploadURL from "./components/uploadURL.js";
import queryPinecone from "./components/queryPinecone.js";
import { urlsData } from "./components/urlsData.js";
import uploadPDF from "./components/uploadPDF.js";
import multerPDF from "./components/multerPDF.js";
import {
  setTemperature,
  getTemperature,
  setUserPrompt,
  getUserPrompt,
} from "./components/modelConfig.js";
import uploadURLWindow from "./components/uploadURL_Chroma.js";

// use chroma and stream output and retrievalQAChain
import { Chroma } from "langchain/vectorstores/chroma";
import { ChromaClient } from "chromadb";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CallbackManager } from "langchain/callbacks";
import { RetrievalQAChain } from "langchain/chains";
import { Readable, pipeline } from "stream";
import { promisify } from "util";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

// limit the request amount in a certain time
import rateLimit from "express-rate-limit";
import { inMemoryConfig as config } from "./components/chatLimiter.js";

import {
  getLimitTime,
  setLimitTime,
  getMaxRequest,
  setMaxRequest,
  getRequestPreventMessage,
  setRequestPreventMessage,
} from "./components/systemConfig.js";

import path from "path";

dotenv.config({ path: "../../.env" });

const app = express();
const port = 3000;

/** STEP ONE AND TWO: LOAD DOCUMENT AND STORE DATA INTO DATABASE*/
// test with a single page
// uploadURL(urlsData);
// console.log("Upload finished");

// cross origin resource sharing
app.use(bodyParser.json());
app.use(cors());

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.set("trust proxy", 1);

// build a limiter
let ChatRateLimiter = rateLimit(config);

app.post("/chatBox", async (req, res) => {
  const { input } = req.body;
  // connect to the database
  const vectorStore = await Chroma.fromExistingCollection(
    new OpenAIEmbeddings(),
    {
      collectionName: "website-collection",
    }
  );
  // look at the collection
  const collectionClient = new ChromaClient();
  const collection = await collectionClient.getCollection({
    name: "website-collection",
  });
  console.log(collection);

  // set a instance of openai
  const model = new OpenAI({
    modelName: "gpt-3.5-turbo-16k",
    temperature: getTemperature(),
  });

  // set a chain to connect the vectorstore and openai
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
    returnSourceDocuments: true, // the number of the source documents returned by default is 4
  });
  // const CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT = `Given the following conversation and a follow up question, return the conversation history excerpt that includes any relevant context to the question if it exists and rephrase the follow up question to be a standalone question.
  // Chat History:
  // {chat_history}
  // Follow Up Input: {question}
  // Your answer should follow the following format:
  // \`\`\`
  // You have a name called: Leo
  // ----------------
  // <Relevant chat history excerpt as context here>
  // Standalone question: <Rephrased question here>
  // \`\`\`
  // Your answer:`;

  // const chain = ConversationalRetrievalQAChain.fromLLM(
  //   model,
  //   vectorStore.asRetriever(),
  //   {
  //     memory: new BufferMemory({
  //       memoryKey: "chat_history",
  //       returnMessages: false,
  //     }),
  //   },
  //   {
  //     returnSourceDocuments: true,
  //     questionGeneratorChainOptions: {
  //       template: CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT,
  //     },
  //   }
  // );

  // return the response
  const response = await chain.call({ query: input });
  console.log(response);

  return res.status(200).json({ result: response });

  /* Try to make a stream but was experiencing some issues*/
  // // set a encoder
  // const encoder = new TextEncoder();
  // // set a stream style output
  // const stream = new Readable({
  //   async read() {
  //     // when token is received, encode it and push it to the stream
  //     const onNewToken = (token) => {
  //       const encodedToken = encoder.encode(token);
  //       this.push(encodedToken);
  //     };
  //     // when ths stream is ended, push null to the stream
  //     const onEnd = () => {
  //       this.push(null);
  //     };

  //     // set a OpenAI instance
  //     const model = new OpenAI({
  //       streaming: true,
  //       modelName: "gpt-3.5-turbo",
  //       temperature: getTemperature(),
  //       callbacks: new CallbackManager({
  //         handleLLMToken: onNewToken,
  //         handleLLMEND: onEnd,
  //       }),
  //     });

  //     // set a retrievalQAChain instance
  //     const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
  //       returnSourceDocuments: true,
  //     });

  //     // call the chain
  //     const response = await chain.call({ query: input });

  //     // push the response to the stream
  //     if (response) {
  //       const encodedResponse = encoder.encode(response);
  //       stream.push(encodedResponse);
  //     }
  //   },
  // });
  // // set a pipeline to handle the stream
  // pipeline(stream, res, (err) => {
  //   if (err) {
  //     console.log("Error occured:", err);
  //     res.status(500).end("Server Error");
  //   } else {
  //     Console.log("Pipeline succeeded");
  //   }
  // });
});

// limit the request amount in a certain time
app.post("/chat", ChatRateLimiter, async (req, res) => {
  if (req.method === "POST") {
    // console.log("Inside the PDF handler");

    /** STEP THREE: QUERY THE DATABASE */
    // Grab the user prompt
    const { input } = req.body;

    if (!input) {
      throw new Error("No input");
    }

    console.log("input received:", input);

    /* Use as part of a chain (currently no metadata filters) */

    // connect the database
    const vectorStore = await queryPinecone();
    // set a instance of openai
    const model = new OpenAI({
      modelName: "gpt-3.5-turbo-16k",
      temperature: getTemperature(),
    });
    // set a chain to connect the vectorstore and openai

    // const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    //   // k: 1, // number of the most related documents
    //   returnSourceDocuments: true,
    // });
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
      returnSourceDocuments: true, // the number of the source documents returned by default is 4
    });

    // set system prompt

    const response = await chain.call({ query: getUserPrompt() + input });
    console.log(response);
    // console.log(getTemperature());
    return res.status(200).json({ result: response });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
});

app.post("/urlUpload", async (req, res) => {
  try {
    const { url } = req.body;
    // console.log(url);
    await uploadURL([url]);

    console.log("Upload finished");
    return res.status(200).json({ message: "Upload finished" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/urlUploadWindow", async (req, res) => {
  try {
    const { url } = req.body;
    // console.log(url);
    await uploadURLWindow([url]);

    console.log("Upload finished");
    return res.status(200).json({ message: "Upload finished" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/pdfUpload", multerPDF().single("file"), async (req, res) => {
  try {
    // convert the path to a absolute path, a relative path will cause error
    const absolutePath = path.resolve(req.file.path);
    await uploadPDF(absolutePath);

    console.log("Upload finished");
    return res.status(200).json({ message: "Upload finished" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/setApiKey", (req, res) => {
  const { apiKey } = req.body;
  process.env.OPENAI_API_KEY = apiKey;

  return res.status(200).json({ message: "API key updated" });
});

app.get("/getApiKey", (req, res) => {
  res.json({
    apiKey: process.env.OPENAI_API_KEY,
  });
});

app.post("/setTemperature", (req, res) => {
  const { temperature } = req.body;
  setTemperature(temperature);

  return res.status(200).json({ message: "Temperature updated" });
});

app.get("/getTemperature", (req, res) => {
  res.json({
    temperature: getTemperature(),
  });
});

app.post("/setUserPrompt", (req, res) => {
  const { userPrompt } = req.body;
  setUserPrompt(userPrompt);

  return res.status(200).json({ message: "UserPrompt updated" });
});

app.get("/getUserPrompt", (req, res) => {
  res.json({
    userPrompt: getUserPrompt(),
  });
});

app.get("/getLimiterConfig", (req, res) => {
  res.json(config);
});

app.post("/uploadLimiterConfig", (req, res) => {
  // update the config
  config.windowMs = req.body.windowMs;
  config.max = req.body.max;
  config.message = req.body.message;
  console.log(config.max, config.windowMs, config.message);
  // update the limiter
  ChatRateLimiter = rateLimit(config);

  res.json(config);
});

// save the config in the env file before the server is closed
// "beforeExit" is for the server closed normal as "SIGTERM". In terminal, it is 'kill 12345'
// "SIGINT" is for the server closed by "Ctrl+C" in terminal
import fs from "fs";
process.on("SIGINT", () => {
  // load the env config
  const envConfig = dotenv.parse(
    fs.readFileSync("/Users/huayuqin/quasar-project/.env")
  );

  // modify the config in the process
  envConfig.RATE_LIMIT_WINDOW = config.windowMs;
  envConfig.RATE_LIMIT_MAX = config.max;
  envConfig.RATE_LIMIT_MESSAGE = config.message;

  // format the environment config to be written to the file
  const envConfigString = Object.entries(envConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  // write the config to the file
  fs.writeFileSync("/Users/huayuqin/quasar-project/.env", envConfigString);
  // exit the process
  process.exit();
});

// app.post("/setLimitTime", (req, res) => {
//   const { limitTime } = req.body;
//   setLimitTime(limitTime);

//   return res.status(200).json({ message: "limitTime updated" });
// });

// app.get("/getLimitTime", (req, res) => {
//   res.json({
//     limitTime: getLimitTime(),
//   });
// });

// app.get("/getMaxRequest", (req, res) => {
//   res.json({
//     maxRequest: getMaxRequest(),
//   });
// });

// app.post("/setMaxRequest", (req, res) => {
//   const { maxRequest } = req.body;
//   setMaxRequest(maxRequest);

//   return res.status(200).json({ message: "MaxRequest updated" });
// });

// app.get("/getRequestPreventMessage", (req, res) => {
//   res.json({
//     requestPreventMessage: getRequestPreventMessage(),
//   });
// });

// app.post("/setRequestPreventMessage", (req, res) => {
//   const { requestPreventMessage } = req.body;
//   setRequestPreventMessage(requestPreventMessage);

//   return res.status(200).json({ message: "requestPreventMessage updated" });
// });

// 0.0.0.0 is for the server to listen to all the IP addresses
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

/* Delete the data in the Pinecone database

make it in terminal

(base) huayuqin@Huayus-MacBook-Air quasar-project % curl -X DELETE \
    -H 'Api-Key: 2f98f511-e1b4-4138-b16f-11090db7df08' \
    'https://langchain-js-c6b0278.svc.us-west4-gcp-free.pinecone.io/vectors/namespace=default'
(base) huayuqin@Huayus-MacBook-Air quasar-project % curl --request POST \
    -H 'Api-Key: 2f98f511-e1b4-4138-b16f-11090db7df08' \ --url https://langchain-js-c6b0278.svc.us-west4-gcp-free.pinecone.io/vectors/delete \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "deleteAll": "true"
}
'

curl: (3) URL using bad/illegal format or missing URL
{}%


*/
