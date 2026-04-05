import * as fs from "fs";
import path from "path";
import moment from "moment";
import winston from "winston";
import { fileURLToPath } from "url";
import { dirname } from "path";

const { createLogger, format, transports } = winston;
const { combine, printf, timestamp } = format;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logDirectory = path.join(__dirname, "../../log");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const myFormat = printf(({ level, message, timestamp }) => {
  return `${moment(timestamp).format(
    "DD-M-YYYY hh:mm:ss A",
  )} ${level}: ${message}`;
});

const mainLogger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.File({ filename: path.join(logDirectory, "main.log") }),
  ],
});

const createMyLogger = (filename) => {
  return createLogger({
    format: combine(timestamp(), myFormat),
    transports: [
      new transports.File({
        filename: path.join(logDirectory, `${filename}.log`),
      }),
    ],
  });
};

const logToMain = (type, filename) => {
  if (type === "Success") {
    mainLogger.info(`${type} log entry in ${filename}.log`);
  } else if (type === "Error") {
    mainLogger.error(`${type} log entry in ${filename}.log`);
  }
};

const Logger = {
  controllerLogger: {
    logSuccess: function (message) {
      createMyLogger("controller").info(message);
      logToMain("Success", "controller");
    },
    logError: function (error) {
      createMyLogger("controller").error(`${error.message}\n${error.stack}`);
      logToMain("Error", "controller");
    },
  },
  serverLogger: {
    logSuccess: function (message) {
      createMyLogger("server").info(message);
      logToMain("Success", "server");
    },
    logError: function (error) {
      createMyLogger("server").error(`${error.message}\n${error.stack}`);
      logToMain("Error", "server");
    },
  },
  databaseLogger: {
    logSuccess: function (message) {
      createMyLogger("database").info(message);
      logToMain("Success", "database");
    },
    logError: function (error) {
      createMyLogger("database").error(`${error.message}\n${error.stack}`);
      logToMain("Error", "database");
    },
  },
  generalLogger: {
    logSuccess: function (message) {
      createMyLogger("general").info(message);
      logToMain("Success", "general");
    },
    logError: function (error) {
      createMyLogger("general").error(`${error.message}\n${error.stack}`);
      logToMain("Error", "general");
    },
  },
  brokerLogger: {
    logSuccess: function (message) {
      createMyLogger("broker").info(message);
      logToMain("Success", "broker");
    },
    logError: function (error) {
      createMyLogger("broker").error(`${error.message}\n${error.stack}`);
      logToMain("Error", "broker");
    },
  },
  stripeWebhook: {
    logSuccess: function (message) {
      createMyLogger("stripeWebhook").info(message);
      logToMain("Success", "stripeWebhook");
    },
    logError: function (error) {
      createMyLogger("stripeWebhook").error(`${error.message}\n${error.stack}`);
      logToMain("Error", "stripeWebhook");
    },
  },
};
export default Logger;
