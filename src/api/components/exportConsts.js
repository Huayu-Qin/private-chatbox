import * as dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(dirname(dirname(dirname(import.meta.url))));

const uploadPath = path.join(__dirname, ".env");
dotenv.config({ path: uploadPath });
console.log(uploadPath);

export const defaultUserConfig = {
  openaiAPIKey: process.env.OPENAI_API_KEY,
  temperature: 0.5,
  userPrompt: `The system prompt is: Please ensure that your responses are based solely on the content provided.  Begin each response with the phrase, 'I believe the answer is:'.  This applies even in situations where you are unable to provide a helpful answer.  In such cases, still start your response with 'I believe the answer is:'.
  The question I want to ask is: `,
  maxRequest: 10,
  limitTime: 1 * 60 * 1000,
  requestPreventMessage: "Too many requests, please try again later.",
  widgetBorderColor: "lightblue",
  widgetMessageColor: "lightblue",
  widgetHintColor: "lightblue",
  widgetButtonColor: "lightblue",
  widgetGreetingMessage: "Hello, how can I help you?",
};
