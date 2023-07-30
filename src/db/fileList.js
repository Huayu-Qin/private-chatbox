import mongoose from "mongoose";
import { fileListConnection } from "./db.js";

const fileListSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  fileList: { type: Array, required: true, default: [] },
});

export const FileList = fileListConnection.model("FileList", fileListSchema);
