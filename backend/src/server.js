import { randomUUID } from "node:crypto";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { loadConfig } from "./config.js";
import contactRoutes from "./routes/contact.js";

export function buildServer() {
  const config = loadConfig();

  const app = Fastify({
    logger: {
      level: config.env === "production" ? "info" : "debug",
    },
    genReqId: () => randomUUID(),
  });

  app.decorate("appConfig", config);

  app.addHook("onRequest", async (request) => {
    request.log.info({ requestId: request.id, method: request.method, url: request.url }, "request started");
  });

  app.addHook("onResponse", async (request, reply) => {
    request.log.info(
      { requestId: request.id, statusCode: reply.statusCode, responseTimeMs: reply.elapsedTime },
      "request completed"
    );
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error({ requestId: request.id, err: error }, "request failed");
    reply.status(error.statusCode ?? 500).send({
      error: "internal_error",
      message: "Unexpected error",
      requestId: request.id,
    });
  });

  app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || config.corsOrigins.includes(origin)) {
        cb(null, true);
        return;
      }

      cb(new Error("Origin not allowed"), false);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  });

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "locamulti-backend",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
    };
  });

  app.get("/ready", async (_request, reply) => {
    const checks = {
      configLoaded: config.corsOrigins.length > 0,
    };

    const ready = Object.values(checks).every(Boolean);

    if (!ready) {
      reply.code(503);
    }

    return {
      status: ready ? "ready" : "not_ready",
      checks,
      timestamp: new Date().toISOString(),
    };
  });

  app.register(contactRoutes, { prefix: "/contact" });

  return app;
}
