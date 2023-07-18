// import rateLimit from "express-rate-limit";
// import {
//   getLimitTime,
//   getMaxRequest,
//   getRequestPreventMessage,
// } from "./systemConfig.js";

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

// // create a map to store the limiters and the IPs
// const chatLimiters = new Map();

// export default function ChatRateLimiter(req, res, next) {
//   // set the config of the limiter
//   const config = {
//     windowMs: getLimitTime(), // 1 minute
//     max: getMaxRequest(), // limit each Ip to 2 requests per windowMs
//     message: JSON.stringify({
//       result: {
//         text: getRequestPreventMessage(),
//       },
//     }),
//   };

//   // store the Ips
//   const key = req.ip;

//   // check if the IP is in the map
//   let chatLimiter = chatLimiters.get(key);

//   // if the IP is not in the map or the config is changed,
//   // create a new limiter and store it in the map
//   if (!chatLimiter || chatLimiter.config !== config) {
//     // create a new limiter
//     chatLimiter = rateLimit(config);
//     // store the congfig
//     chatLimiter.config = config;
//     // store the limiter in the map
//     chatLimiters.set(key, chatLimiter);
//   }

//   console.log(
//     chatLimiter,
//     getLimitTime(),
//     getMaxRequest(),
//     getRequestPreventMessage()
//   );
//   chatLimiter(req, res, () => {
//     console.log("chatLimiter");
//     next();
//   });
// }
