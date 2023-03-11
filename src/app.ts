import express from "express";
import bodyParser from "body-parser";
import { createUser, getUsers } from "./controllers/UserController";
import * as postController from "./controllers/PostController";
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/getUsers", getUsers);
app.post("/createUser", createUser);

// Post routes
app.post("/posts", postController.create);
app.get("/posts", postController.index);
app.get("/posts/:id", postController.show);
app.put("/posts/:id", postController.update);
app.delete("/posts/:id", postController.destroy);

app.get("/", (_, res) => {
	res.send("Script created by Matheus Souza.");
});

app.listen(port, () => {
	console.log(`App running at http://localhost:${port}`);
});
