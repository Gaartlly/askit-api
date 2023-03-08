import express from "express";
import bodyParser from "body-parser";
import commentRoutes from "./routes/commentRoutes"

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.send("Script created by Matheus Souza.");
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});

/**
 * App routes
 */
app.use('/api/comments', commentRoutes);