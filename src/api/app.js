import express from "express";

// query the database and return the answer
import { ConversationChain, LLMChain, VectorDBQAChain } from "langchain/chains";
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
import uploadPDFWindow from "./components/uploadPDF_Chroma.js";
import deleteDocument from "./components/deleteDocument.js";
import {
  setWidgetBorderColor,
  setWidgetButtonColor,
  setWidgetHintColor,
  setWidgetMessageColor,
  getWidgetBorderColor,
  getWidgetButtonColor,
  getWidgetHintColor,
  getWidgetMessageColor,
  getWidgetGreetingMessage,
  setWidgetGreetingMessage,
} from "./components/widgetConfig.js";

// use chroma and stream output and retrievalQAChain
import { Chroma } from "langchain/vectorstores/chroma";
import { ChromaClient } from "chromadb";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RetrievalQAChain } from "langchain/chains";
// sequential chain
import { SequentialChain } from "langchain/chains";
// stuff related to the stream
import SSE from "express-sse";
import compression from "compression";
// Stuff related to the conversational chain
// ConversationRetrievalQAChain can get the memory and retrieve the answer from the database
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

// SerpAPI used to get the search result
import { SerpAPILoader } from "langchain/document_loaders/web/serpapi";
import realTimeSearch from "./components/realTimeSearch.js";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// limit the request amount in a certain time
import rateLimit from "express-rate-limit";
import { inMemoryConfig as config } from "./components/chatLimiter.js";

// stuff related to the memory
import {
  vectorStoreMemory,
  conversationSummaryMemory,
  bufferMemory,
  redisChatMemory,
  vectorStoreWithMemory,
} from "./components/storeMemory.js";
import { BasePromptTemplate, PromptTemplate } from "langchain";
// deprecated
import {
  getLimitTime,
  setLimitTime,
  getMaxRequest,
  setMaxRequest,
  getRequestPreventMessage,
  setRequestPreventMessage,
} from "./components/systemConfig.js";

import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { UserConfig } from "../db/userConfig.js";
import { FileList } from "../db/fileList.js";

dotenv.config({ path: "../../.env" });

const app = express();
const port = 3000;

const sse = new SSE();
app.use(compression());
// cross origin resource sharing
app.use(bodyParser.json());
app.use(cors());

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.set("trust proxy", 1);

// initialize a limiter
let ChatRateLimiter = rateLimit(config);

// connect to SSE and initialize the SSE when client connect to endpoint
app.get("/chatMemory", sse.init);
// store the chat history and send updates to the frontend
app.post("/chatMemory", async (req, res) => {
  if (req.method === "POST") {
    const { input } = req.body;
    // use redis to store the chat history
    const memory = redisChatMemory;
    const model = new OpenAI({
      temperature: getTemperature(),
      modelName: "gpt-3.5-turbo",
      streaming: true,
      callbacks: [
        {
          // set the start token and send tokens to the frontend
          handleLLMNewToken(token) {
            sse.send(token, "newToken");
          },
        },
      ],
    });

    // prompt template
    const prompt =
      PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

    Relevant pieces of previous conversation:
    {chat_history}

    (You do not need to use these pieces of information if not relevant)

    Current conversation:
    Human: {input}
    AI:`);
    // use the conversationSummaryMemory and vectorStoreMemory
    // to store the conversation by LLMChain
    // const chain = new LLMChain({ llm: model, prompt: prompt, memory: memory });

    // use the bufferMemory and redis to store the conversation by ConversationChain
    const chain = new ConversationChain({ llm: model, memory: memory });
    // const chain = new ConversationalRetrievalQAChain(model,)
    await chain.call({ input }).then(() => {
      // when the conversation is finished, trigger the stop event
      sse.send(null, "stop");
    });
    // const response = await chain.call({ input });
    // await memory.loadMemoryVariables({}) got issues when using the vectorStoreMemory
    // console.log({ response, memory: await memory.loadMemoryVariables({}) });
    return res.status(200).json({ result: "Streaming completed" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
});

app.get("/chatRealTime", sse.init);
// store the chat history and send updates to the frontend
app.post("/chatRealTime", async (req, res) => {
  if (req.method === "POST") {
    const { input } = req.body;
    // console.log(input);
    const docs = await realTimeSearch(input);
    console.log("search doc: ", docs.length);
    const memory = conversationSummaryMemory;
    // const vectorDatabase = vectorStoreWithMemory;
    const vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings()
    );
    const model = new OpenAI({
      temperature: getTemperature(),
      modelName: "gpt-3.5-turbo-16k",
      streaming: true,
      callbacks: [
        {
          handleLLMNewToken(token) {
            sse.send(token, "newToken");
          },
        },
      ],
    });

    // const prompt = new BasePromptTemplate({
    //   prompts:
    //     `You need to say 'Hi,darling' as you prefix words in the reply. The question is: ${input}`,
    // });
    // const formattedPrompt = await prompt.format({ input: input });
    // use the conversationSummaryMemory and vectorStoreMemory
    // to store the conversation by LLMChain
    // const chain = new LLMChain({ llm: model, prompt: prompt, memory: memory });

    // use the bufferMemory and redis to store the conversation by ConversationChain
    // const memoryChain = new LLMChain({
    //   llm: model,
    //   prompt: prompt,
    //   memory: memory,
    // });

    const searchChain = RetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever()
      // {
      // prompt: prompt,
      // verbose: true,
      // returnSourceDocuments: true,
      // }
    );
    // const chain = ConversationalRetrievalQAChain.fromLLM(
    //   model,
    //   vectorStore.asRetriever(),
    //   {
    //     returnSourceDocuments: true,
    //     memory: memory,
    //     qaTemplate: formattedPrompt,
    //     outputKey: "answer",
    //   }
    // );

    await searchChain.call({ query: input }).then(() => {
      sse.send(null, "stop");
    });
    // const response = await chain.call({ input });
    // await memory.loadMemoryVariables({}) got issues when using the vectorStoreMemory
    // console.log({ response, memory: await memory.loadMemoryVariables({}) });
    return res.status(200).json({ result: "Streaming completed" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
});

app.post("/chatBox", async (req, res) => {
  const { input } = req.body;
  // connect to the Chroma
  const vectorStore = await Chroma.fromExistingCollection(
    new OpenAIEmbeddings(),
    {
      collectionName: "website-collection",
    }
  );
  // set a instance of model
  const model = new OpenAI({
    modelName: "gpt-3.5-turbo-16k",
    temperature: getTemperature(),
  });

  // set a chain to connect the vectorstore and model
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
    returnSourceDocuments: true, // the number of the source documents returned by default is 4
  });

  // return the response from the model
  const response = await chain.call({ query: input });
  console.log(response);

  return res.status(200).json({ result: response });
});

// limit the request amount in a certain time
app.post("/chat", ChatRateLimiter, async (req, res) => {
  if (req.method === "POST") {
    /** QUERY THE DATABASE */
    // Grab the user prompt from frontend
    const { input } = req.body;

    if (!input) {
      throw new Error("No input");
    }

    console.log("input received:", input);

    // connect to the Pinecone
    const vectorStore = await queryPinecone("test4");

    // set a instance of model
    const model = new OpenAI({
      modelName: "gpt-3.5-turbo-16k",
      temperature: getTemperature(),
    });

    // const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    //   // k: 1, // number of the most related documents
    //   returnSourceDocuments: true,
    // });

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
      returnSourceDocuments: true, // the number of the source documents returned by default is 4
    });

    // set a prompt for every input
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

    await uploadURL([url]);

    console.log("Upload finished");
    return res.status(200).json({ message: "Upload finished" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/pdfUpload", multerPDF().single("file"), async (req, res) => {
  try {
    console.log(req.body.userId);
    // convert the path to a absolute path, a relative path caused error
    const absolutePath = path.resolve(req.file.path);
    console.log(absolutePath);
    console.log(req.body.name);
    const UniqueName = absolutePath.split("/").pop();
    await uploadPDF(absolutePath, UniqueName, req.body.userId);

    console.log("Upload finished");
    return res.status(200).json({
      message: "Upload finished",
      fileName: UniqueName,
      userId: req.body.userId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/urlUploadWindow", async (req, res) => {
  try {
    const { url, userId } = req.body;
    const UniqueName = url.split(".")[1] + Date.now();
    await uploadURLWindow([url], UniqueName, userId);

    console.log("Upload finished");
    return res.status(200).json({
      message: "Upload finished",
      urlName: UniqueName,
      userId: userId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.delete("/deleteUrl/:urlName", (req, res) => {
  const urlName = req.params.urlName;
  // get the userId from the query
  const userId = req.query.userId;

  // delete the file in the database
  deleteDocument(userId, urlName);
  return res.status(200).json({ message: "Url deleted" });
});

app.post("/pdfUploadWindow", multerPDF().single("file"), async (req, res) => {
  try {
    console.log(req.body.userId);
    // convert the path to a absolute path, a relative path caused error
    const absolutePath = path.resolve(req.file.path);
    console.log(absolutePath);
    console.log(req.body.name);
    const UniqueName = absolutePath.split("/").pop();
    await uploadPDFWindow(absolutePath, UniqueName, req.body.userId);

    console.log("Upload finished");
    return res.status(200).json({
      message: "Upload finished",
      fileName: UniqueName,
      userId: req.body.userId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.delete("/deleteFile/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  // get the userId from the query
  const userId = req.query.userId;
  const filePath = path.join(
    fileURLToPath(dirname(dirname(dirname(import.meta.url)))),
    "/public/uploads/" + fileName
  );
  console.log(filePath);
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to delete the file" });
      } else {
        console.log("File deleted");
        return res.status(200).json({ message: "File deleted" });
      }
    });
  } else {
    return res.status(404).json({ message: "File not found" });
  }

  // delete the file in the database
  deleteDocument(userId, fileName);
});

// app.post("/setApiKey", (req, res) => {
//   const { apiKey } = req.body;
//   process.env.OPENAI_API_KEY = apiKey;
//   return res.status(200).json({ message: "API key updated" });
// });

// app.get("/getApiKey", (req, res) => {
//   res.json({
//     apiKey: process.env.OPENAI_API_KEY,
//   });
// });

// app.post("/setTemperature", (req, res) => {
//   const { temperature } = req.body;
//   setTemperature(temperature);

//   return res.status(200).json({ message: "Temperature updated" });
// });

// app.get("/getTemperature", (req, res) => {
//   res.json({
//     temperature: getTemperature(),
//   });
// });

// app.post("/setUserPrompt", (req, res) => {
//   const { userPrompt } = req.body;
//   setUserPrompt(userPrompt);
//   return res.status(200).json({ message: "UserPrompt updated" });
// });

// app.get("/getUserPrompt", (req, res) => {
//   res.json({
//     userPrompt: getUserPrompt(),
//   });
// });

// app.get("/getLimiterConfig", (req, res) => {
//   res.json(config);
// });

// app.post("/uploadLimiterConfig", (req, res) => {
//   // update the config
//   config.windowMs = req.body.windowMs;
//   config.max = req.body.max;
//   config.message = req.body.message;
//   console.log(config.max, config.windowMs, config.message);
//   // update the limiter
//   ChatRateLimiter = rateLimit(config);

//   res.json(config);
// });

// app.post("/setWidgetConfig", (req, res) => {
//   const {
//     widgetGreetingMessage,
//     widgetBorderColor,
//     widgetButtonColor,
//     widgetHintColor,
//     widgetMessageColor,
//   } = req.body;
//   setWidgetGreetingMessage(widgetGreetingMessage);
//   setWidgetBorderColor(widgetBorderColor);
//   setWidgetButtonColor(widgetButtonColor);
//   setWidgetHintColor(widgetHintColor);
//   setWidgetMessageColor(widgetMessageColor);

//   return res.status(200).json({ message: "Widget config updated" });
// });

// app.get("/getWidgetConfig", (req, res) => {
//   res.json({
//     widgetGreetingMessage: getWidgetGreetingMessage(),
//     widgetBorderColor: getWidgetBorderColor(),
//     widgetButtonColor: getWidgetButtonColor(),
//     widgetHintColor: getWidgetHintColor(),
//     widgetMessageColor: getWidgetMessageColor(),
//   });
// });
// // save the config in the env file before the server is closed
// // "beforeExit" is for the server closed normal as "SIGTERM". In terminal, it is 'kill 12345'
// // "SIGINT" is for the server closed by "Ctrl+C" in terminal

// process.on("SIGINT", () => {
//   // load the env config
//   const envConfig = dotenv.parse(
//     fs.readFileSync("/Users/huayuqin/quasar-project/.env")
//   );

//   // modify the config in the process
//   envConfig.RATE_LIMIT_WINDOW = config.windowMs;
//   envConfig.RATE_LIMIT_MAX = config.max;
//   envConfig.RATE_LIMIT_MESSAGE = config.message;

//   // format the environment config to be written to the file
//   const envConfigString = Object.entries(envConfig)
//     .map(([key, value]) => `${key}=${value}`)
//     .join("\n");
//   // write the config to the file
//   fs.writeFileSync("/Users/huayuqin/quasar-project/.env", envConfigString);
//   // exit the process
//   process.exit();
// });

app.post("/userConfig", async (req, res) => {
  try {
    const existingUserConfig = await UserConfig.findOne({
      userId: req.body.userId,
    });
    if (existingUserConfig) {
      res.status(400).send({ error: "User config already exists" });
    } else {
      // initialize the user config in the databas
      const userConfig = new UserConfig({ userId: req.body.userId });
      await userConfig.save();
      console.log("User config saved");
      res.status(201).send(userConfig);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Could not save user config" });
  }
});

app.put("/userConfig/:userId", async (req, res) => {
  try {
    const userConfig = await UserConfig.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, runValidators: true, upsert: true }
    );
    if (userConfig) {
      res.send(userConfig);
    } else {
      res.status(404).send({ error: "User config not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Could not update user config" });
  }
});

app.get("/userConfig/:userId", async (req, res) => {
  try {
    const userConfig = await UserConfig.findOne({ userId: req.params.userId });
    if (userConfig) {
      res.send(userConfig);
    } else {
      res.status(404).send({ error: "User config not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Could not retrieve user config" });
  }
});

app.post("/fileList", async (req, res) => {
  const { userId, files } = req.body;
  try {
    const fileList = await FileList.findOneAndUpdate(
      { userId },
      { userId, fileList: files },
      { new: true, runValidators: true, upsert: true }
    );
    if (fileList) {
      res.send(fileList);
    } else {
      res.status(404).send({ error: "File list not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Could not update file list" });
  }
});

app.get("/fileList/:userId", async (req, res) => {
  try {
    const fileList = await FileList.findOne({ userId: req.params.userId });
    if (fileList) {
      res.send(fileList);
    } else {
      res.status(404).send({ error: "File list not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Could not retrieve file list" });
  }
});

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
