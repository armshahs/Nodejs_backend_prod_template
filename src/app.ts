import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
// import routes from "./routes";
// import { AppDataSource } from "./database";
import { errorHandler } from "./middleware";
import { EntityNotFoundError } from "./errors";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// JSON request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use("/api/v1/", routes);
app.get("/api/v1/test", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World!",
  });
});
app.get("/api/v1/test2", (req: Request, res: Response) => {
  // throw new Error("Oops");
  throw new EntityNotFoundError({
    message: "Entity not found",
    statusCode: 404,
    code: "ERR_NF",
  });
  res.status(200).json({
    message: "Hello World!",
  });
});

// Error handling  (should be last middleware to process requests)
app.use(errorHandler);

export default app;
