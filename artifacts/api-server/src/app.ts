import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import path from "node:path";
import fs from "node:fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
const corsOrigin = process.env["CORS_ORIGIN"];
app.use(
  cors({
    origin: corsOrigin
      ? corsOrigin.split(",").map((o) => o.trim()).filter(Boolean)
      : true,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Static + SPA fallback. PUBLIC_DIR is set in the Dockerfile to the directory
// containing the Vite-built frontend. If unset (dev), this whole block no-ops.
const publicDir = process.env["PUBLIC_DIR"];
if (publicDir && fs.existsSync(publicDir)) {
  app.use(
    express.static(publicDir, {
      maxAge: "1d",
      index: false,
    }),
  );
  const indexHtml = path.join(publicDir, "index.html");
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    res.sendFile(indexHtml);
  });
}

export default app;
