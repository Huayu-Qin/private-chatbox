import * as dotenv from "dotenv";
dotenv.config({ path: "/Users/huayuqin/quasar-project/.env" });

// load the env config
const { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX, RATE_LIMIT_MESSAGE } = process.env;
// console.log(process.env);
export let inMemoryConfig = {
  windowMs: parseInt(RATE_LIMIT_WINDOW),
  max: parseInt(RATE_LIMIT_MAX),
  message: JSON.stringify(RATE_LIMIT_MESSAGE),
};

