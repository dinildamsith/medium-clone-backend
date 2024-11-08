import express, { Request, Response } from 'express';
import mongoose from "./config/dbConfig"
import PostController from "./controller/postController";
import UserController from "./controller/userController";
import bodyParser from "body-parser";
import cors from 'cors';

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());


mongoose.connect("mongodb://localhost:27017/medium-db");
app.use("/api",PostController,UserController);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

