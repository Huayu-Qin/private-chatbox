import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { VectorStoreRetrieverMemory } from "langchain/memory";
import { ConversationSummaryMemory } from "langchain/memory";
import { RedisChatMessageHistory } from "langchain/stores/message/redis";

import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";

const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

export const vectorStoreMemory = new VectorStoreRetrieverMemory({
  vectorStoreRetriever: vectorStore.asRetriever(1),
  memoryKey: "history",
});

export const conversationSummaryMemory = new ConversationSummaryMemory({
  memortKey: "history",
  llm: new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 }),
});

export const bufferMemory = new BufferMemory();

export const redisChatMemory = new BufferMemory({
  chatHistory: new RedisChatMessageHistory({
    sessionId: new Date().toISOString(), // identifier for the conversion
    sessionTTL: 5 * 60, // 5 minutes
    config: {
      url: "redis://localhost:6379",
    },
  }),
});
