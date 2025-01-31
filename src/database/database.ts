import { DataSource } from "typeorm";
import { config } from "../config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: config.database.synchronize,
  logging: config.database.logging,
  entities: config.database.entities,
  migrations: config.database.migrations,
  subscribers: config.database.subscribers,
  //   poolSize: config.database.poolSize,
  ssl:
    config.server.nodeEnv === "production"
      ? { rejectUnauthorized: false }
      : false, // for connecting to ssl enabled db
});
