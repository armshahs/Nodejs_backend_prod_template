import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
// import routes from "./routes";
// import { AppDataSource } from "./database";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// JSON request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize TypeORM
// AppDataSource.initialize()
//   .then(() => {
//     console.log("Data Source has been initialized!");
//   })
//   .catch((error) => {
//     console.error("Error during Data Source initialization:", error);
//   });

// Routes
// app.use("/api/v1/", routes);
app.get("/api/v1/test", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World!",
  });
});

// Error handling  (should be last)
// app.use(errorHandler);

export default app;
