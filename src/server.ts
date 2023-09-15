import express from "express";
import mongoose from "mongoose";
import { config } from "./config/database";
import { userRouter } from "./routes/userRoutes";

const app = express();

const startServer = () => {
  /** Rules of API */
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }

    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/api", userRouter);

  /** Healthcheck */
  app.get("/ping", (req, res, next) => {
    res.status(200).json({ hello: "world" });
  });

  app.use((req, res, next) => {
    const error = new Error("Not found");

    console.log(error);

    res.status(404).json({
      message: error.message,
    });
  });

  app.listen(config.server.port);
};

mongoose
  .connect(config.mongo.url, {
    retryWrites: true,
    w: "majority",
    dbName: "assessment",
  })
  .then(() => {
    console.log("Mongo connected successfully.");
    startServer();
  })
  .catch((error) => console.log(error));
