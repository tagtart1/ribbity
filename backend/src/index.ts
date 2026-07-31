import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Ribbity backend listening on port ${port}`);
});
