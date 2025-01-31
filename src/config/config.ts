import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const config = {
  database: {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mydb",
    synchronize: false,
    logging: process.env.NODE_ENV !== "production", // Enable logging in development
    entities: [isProduction ? "dist/models/**/*.js" : "src/models/**/*.ts"], // Path to your entity files
    migrations: [
      isProduction
        ? "dist/database/migrations/**/*.js"
        : "src/database/migrations/**/*.ts",
    ], // Path to your migration files
    subscribers: [
      isProduction
        ? "dist/database/subscribers/**/*.js"
        : "src/database/subscribers/**/*.ts",
    ], // Path to your subscriber files
    poolSize: 10, // Set a connection pool size
  },
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
  },
};
