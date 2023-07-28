import * as dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(
  dirname(dirname(dirname(dirname(import.meta.url))))
);

const uploadPath = path.join(__dirname, ".env")
dotenv.config({ path: uploadPath });
console.log(uploadPath);
// load the env config
const { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX, RATE_LIMIT_MESSAGE } = process.env;
// console.log(process.env);
export let inMemoryConfig = {
  windowMs: parseInt(RATE_LIMIT_WINDOW),
  max: parseInt(RATE_LIMIT_MAX),
  message: JSON.stringify(RATE_LIMIT_MESSAGE),
};
