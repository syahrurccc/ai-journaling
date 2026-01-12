import { createApp } from "./app";

const app = createApp();
const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down...`);
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);