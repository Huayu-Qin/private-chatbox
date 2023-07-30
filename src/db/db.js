import mongoose from "mongoose";

export const userConfigConnection = mongoose.createConnection(
  "mongodb://localhost:27017/userConfig",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
userConfigConnection.on(
  "error",
  console.error.bind(console, "connection error:")
);
userConfigConnection.once("open", function () {
  console.log("Connected to MongoDB:userConfig");
});

export const fileListConnection = mongoose.createConnection(
  "mongodb://localhost:27017/fileList",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
fileListConnection.on(
  "error",
  console.error.bind(console, "connecttion error:")
);
fileListConnection.once("open", function () {
  console.log("Connected to MongoDB:fileList");
});
