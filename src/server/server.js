import express from "express";
import { cors, rateLimiter, morgan } from "#middlewares";
import ENV from "#env";
const app = express();

app.use(
  cors({
    origin: ENV.CORS,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(rateLimiter);

app.use(morgan("dev"));

export default app;
