import mongoose from "mongoose";
import { defaultUserConfig } from "../api/components/exportConsts.js";
import { userConfigConnection } from "./db.js";

const userConfigSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  openaiAPIKey: {
    type: String,
    required: true,
    default: defaultUserConfig.openaiAPIKey,
  },
  temperature: {
    type: Number,
    required: true,
    min: [0, "Temperature should be between 0 and 1"],
    max: [1, "Temperature should be between 0 and 1"],
    validate: {
      validator: function (v) {
        return /^0\.\d{1}$|^0$|^1$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid temperature between 0 and 1`,
    },
    default: defaultUserConfig.temperature,
  },
  userPrompt: {
    type: String,
    required: true,
    default: defaultUserConfig.userPrompt,
  },
  maxRequest: {
    type: Number,
    required: true,
    default: defaultUserConfig.maxRequest,
  },
  limitTime: {
    type: Number,
    required: true,
    default: defaultUserConfig.limitTime,
  },
  requestPreventMessage: {
    type: String,
    required: true,
    default: defaultUserConfig.requestPreventMessage,
  },
  widgetBorderColor: {
    type: String,
    required: true,
    match: [/^(#[A-Fa-f0-9]{6}|[^#].*)$/, "invalid color"],
    default: defaultUserConfig.widgetBorderColor,
  },
  widgetMessageColor: {
    type: String,
    required: true,
    default: defaultUserConfig.widgetMessageColor,
  },
  widgetHintColor: {
    type: String,
    required: true,
    default: defaultUserConfig.widgetHintColor,
  },
  widgetButtonColor: {
    type: String,
    required: true,
    default: defaultUserConfig.widgetButtonColor,
  },
  widgetGreetingMessage: {
    type: String,
    required: true,
    default: defaultUserConfig.widgetGreetingMessage,
  },
});

export const UserConfig = userConfigConnection.model(
  "UserConfig",
  userConfigSchema
);
