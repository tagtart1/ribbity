import "dotenv/config";
import express from "express";
import { disconnectPrisma } from "./lib/prisma.js";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

const server = app.listen(port, () => {
  console.log(`Ribbity backend listening on port ${port}`);
});

let shuttingDown = false;

const shutdown = (signal: NodeJS.Signals): void => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`Received ${signal}; shutting down`);
  server.close((error) => {
    void disconnectPrisma().finally(() => {
      if (error) console.error("Failed to close the HTTP server:", error);
      process.exit(error ? 1 : 0);
    });
  });
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
