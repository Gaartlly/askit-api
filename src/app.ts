import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import * as postController from "./controllers/PostController";
import * as tagController from "./controllers/TagController";
import { createUser, deleteUser, getUsers, updateUserEmail, updateUserName, updateUserPassword } from "./controllers/UserController";
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

// Post routes
app.post("/posts", postController.create);
app.get("/posts", postController.index);
app.get("/posts/:id", postController.show);
app.put("/posts/:id", postController.update);
app.delete("/posts/:id", postController.destroy);

// Tag routes
app.post("/tags", tagController.create);
app.get("/tags", tagController.index);
app.get("/tags/:id", tagController.show);
app.put("/tags/:id", tagController.update);
app.delete("/tags/:id", tagController.destroy);

// User routes
app.get("/user", getUsers);
app.post("/user/create", createUser);
app.put("/user/update/username", updateUserName);
app.put("/user/update/password", updateUserPassword);
app.put("/user/update/email", updateUserEmail);
app.delete("/user/delete/:id", deleteUser);

// File routes
app.get("/files", getAllFiles);
app.get("/files/:id", getFileById);
app.post("/files/upload", uploadFile);
app.delete("/files/delete/:id", deleteFile);
app.put("/files/update", updateFile);

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
