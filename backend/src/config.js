const DEFAULT_CORS_ORIGINS = [
  "https://admin.locamulti.com",
  "https://locamulti.com",
  "https://locamulti.com.br",
];

function normalizeOrigins(rawOrigins) {
  if (!rawOrigins || typeof rawOrigins !== "string") {
    return DEFAULT_CORS_ORIGINS;
  }

  const origins = rawOrigins
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return origins.length > 0 ? origins : DEFAULT_CORS_ORIGINS;
}

function toBool(value, fallback = false) {
  if (value == null) return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function loadConfig() {
  return {
    env: process.env.NODE_ENV ?? "development",
    port: toNumber(process.env.PORT, 3001),
    host: process.env.HOST ?? "0.0.0.0",
    corsOrigins: normalizeOrigins(process.env.CORS_ORIGINS),
    smtp: {
      host: process.env.SMTP_HOST ?? "smtp.hostinger.com",
      port: toNumber(process.env.SMTP_PORT, 465),
      secure: toBool(process.env.SMTP_SECURE, true),
      user: process.env.SMTP_USER ?? "",
      pass: process.env.SMTP_PASS ?? "",
    },
    contact: {
      to: process.env.CONTACT_TO ?? "atendimento@locamulti.com.br",
      from: process.env.CONTACT_FROM ?? process.env.SMTP_USER ?? "",
      timeoutMs: toNumber(process.env.CONTACT_SEND_TIMEOUT_MS, 10000),
    },
  };
}
