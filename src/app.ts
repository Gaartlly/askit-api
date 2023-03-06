import express from "express";
import bodyParser from "body-parser";
import { createUser, getUsers } from "./controllers/UserController";
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.get("/getUsers", getUsers);
app.post("/createUser", createUser);

app.get("/", (_, res) => {
  res.send("Script created by Matheus Souza.");
});

app.listen(port, () => {
console.log(`App running at http://localhost:${port}`);
});

