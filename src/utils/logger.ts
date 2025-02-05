import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "../config";

const logLevels = {
  error: 0, // highest priority
  warning: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logger = winston.createLogger({
  levels: logLevels,
  level: config.server.logLevel,
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    winston.format.printf(
      ({ timestamp, level, message, logMetadata, stack }) => {
        return `${timestamp} ${level}: ${logMetadata || ""} ${message} ${stack || ""}`;
      },
    ),
  ),
  transports: [new winston.transports.Console()], // AWS automatically pushed console logs to Cloudwatch. Hence
  // you may not need to store to a local file.
});

// For saving the logs as a file (includes daily rotation)
const fileRotateTransport = new DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json(),
  ),
});
logger.add(fileRotateTransport);

export default logger;
