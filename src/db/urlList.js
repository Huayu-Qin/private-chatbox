import mongoose from "mongoose";
import { urlListConnection } from "./db.js";

const urlListSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  urlList: { type: Array, required: true, default: [] },
});

export const UrlList = urlListConnection.model("urlList", urlListSchema);
