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
    logging: false,
    // entities: ["src/models/*.ts"], // migrate:generate will pick entities from this location.
    entities: [isProduction ? "dist/models/*.js" : "src/models/*.ts"], // Path to your entity files
    // migrations: ["src/database/migrations/*.ts"], // migrate:run will pick migrations from this location.
    migrations: [
      isProduction
        ? "dist/database/migrations/**/*.js"
        : "src/database/migrations/**/*.ts",
    ], // Path to your migration files
    subscribers: [],
    poolSize: 10, // Set a connection pool size
  },
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
  },
};
