import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import { createUser, getUsers } from "./controllers/UserController";
import {
  deleteFile,
  getAllFiles,
  getFileById,
  updateFile,
  uploadFile,
} from "./controllers/FileController";
import cloudinary from "cloudinary";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
export const cloud = cloudinary.v2;
cloud.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.send("Script created by Matheus Souza.");
});

app.get("/getUsers", getUsers);
app.post("/createUser", createUser);
app.get("/files", getAllFiles);
app.post("/files/uploadFile", uploadFile);
app.get("/files/getFile/:id", getFileById);
app.delete("/files/deleteFile/:id", deleteFile);
app.put("/files/updateFile", updateFile);

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
