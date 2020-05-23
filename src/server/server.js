import path from "path";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { authenticationRoute } from "./authenticate";

import { Config } from "./config";
import { connectDb } from "./connect-db";
import { TaskRepo } from "./communicate-db";

const { port, mongoUri, isProduction } = Config();

connectDb(mongoUri).then((db) => {
  const app = express();
  const taskRepo = TaskRepo(db);
  const { addNewTask, updateTask } = taskRepo;

  app.use(cors(), bodyParser.urlencoded({ extended: true }), bodyParser.json());
  app.listen(port, console.info("Server running, listening on port ", port));

  authenticationRoute(app, db);

  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, "../../dist")));
    app.get("/*", (req, res) => {
      res.sendFile(path.resolve("index.html"));
    });
  }

  app.post("/task/new", async (req, res) => {
    await addNewTask(req.body.task);
    res.status(200).send();
  });

  app.post("/task/update", async (req, res) => {
    await updateTask(req.body.task);
    res.status(200).send();
  });

  app.post("/comment/new", async (req, res) => {
    let comment = req.body.comment;
    let collection = db.collection(`comments`);
    await collection.insertOne(comment);
    res.status(200).send();
  });
});
