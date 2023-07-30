import mongoose from "mongoose";
import { chatMessageConnection } from "./db.js";

const chatMessageSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  chatMessage: { type: Array, required: true, default: [] },
});

export const ChatMessage = chatMessageConnection.model("chatMessage", chatMessageSchema);
