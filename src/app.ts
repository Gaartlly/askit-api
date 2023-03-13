import express from "express";
import bodyParser from "body-parser";
import { createUser, deleteUser, getUsers, updateUserEmail, updateUserName, updateUserPassword } from "./controllers/UserController";
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// User routes
app.get("/user", getUsers);
app.post("/user/create", createUser);
app.put("/user/update/username", updateUserName);
app.put("/user/update/password", updateUserPassword);
app.put("/user/update/email", updateUserEmail);
app.delete("/user/delete/:id", deleteUser);

app.get("/", (_, res) => {
    res.send("Script created by Matheus Souza.");
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
