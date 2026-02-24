import { buildServer } from "./server.js";
import { loadConfig } from "./config.js";

const config = loadConfig();
const app = buildServer();

async function start() {
  try {
    await app.listen({ port: config.port, host: config.host });
    app.log.info({ port: config.port, host: config.host }, "server listening");
  } catch (error) {
    app.log.error({ err: error }, "failed to start server");
    process.exit(1);
  }
}

start();
