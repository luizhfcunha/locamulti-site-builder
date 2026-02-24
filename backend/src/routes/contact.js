import nodemailer from "nodemailer";

function normalizeText(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePayload(payload) {
  const errors = [];

  const name = normalizeText(payload?.name);
  const company = normalizeText(payload?.company);
  const phone = normalizeText(payload?.phone);
  const email = normalizeText(payload?.email);
  const category = normalizeText(payload?.category);
  const message = normalizeText(payload?.message);

  if (!name) errors.push("name is required");
  if (!phone) errors.push("phone is required");
  if (!email) errors.push("email is required");
  if (email && !isValidEmail(email)) errors.push("email is invalid");
  if (!message) errors.push("message is required");

  return {
    valid: errors.length === 0,
    errors,
    data: { name, company, phone, email, category, message },
  };
}

function escapeHtml(input) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toHtmlMessage(message) {
  return escapeHtml(message).replace(/\n/g, "<br>");
}

function buildEmailContent(payload) {
  const now = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const { name, company, phone, email, category, message } = payload;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #DB5A34; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #3E2229; }
    .value { margin-top: 5px; }
    .message-box { background-color: white; padding: 15px; border-left: 4px solid #DB5A34; margin-top: 10px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nova Mensagem do Site</h1>
      <p>LOCAMULTI - Locacao de Equipamentos</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Data/Hora:</div>
        <div class="value">${escapeHtml(now)}</div>
      </div>
      <div class="field">
        <div class="label">Nome:</div>
        <div class="value">${escapeHtml(name)}</div>
      </div>
      ${company ? `<div class="field"><div class="label">Empresa:</div><div class="value">${escapeHtml(company)}</div></div>` : ""}
      <div class="field">
        <div class="label">Telefone:</div>
        <div class="value">${escapeHtml(phone)}</div>
      </div>
      <div class="field">
        <div class="label">E-mail:</div>
        <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
      </div>
      ${category ? `<div class="field"><div class="label">Categoria de Interesse:</div><div class="value">${escapeHtml(category)}</div></div>` : ""}
      <div class="field">
        <div class="label">Mensagem:</div>
        <div class="message-box">${toHtmlMessage(message)}</div>
      </div>
    </div>
    <div class="footer">
      <p>Este email foi enviado automaticamente pelo formulario de contato do site LOCAMULTI.</p>
    </div>
  </div>
</body>
</html>`;

  const text = [
    "Nova mensagem do site LOCAMULTI",
    "================================",
    "",
    `Data/Hora: ${now}`,
    `Nome: ${name}`,
    company ? `Empresa: ${company}` : "",
    `Telefone: ${phone}`,
    `E-mail: ${email}`,
    category ? `Categoria: ${category}` : "",
    "Mensagem:",
    message,
    "",
    "---",
    "Email automatico do formulario de contato do site LOCAMULTI.",
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text };
}

async function sendMailWithTimeout(transporter, message, timeoutMs) {
  return Promise.race([
    transporter.sendMail(message),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("email_send_timeout")), timeoutMs);
    }),
  ]);
}

export default async function contactRoutes(app) {
  app.post("/send", async (request, reply) => {
    const { smtp, contact } = app.appConfig;

    const validated = validatePayload(request.body);
    if (!validated.valid) {
      reply.code(400);
      return {
        success: false,
        error: {
          code: "validation_error",
          message: "Invalid payload",
          details: validated.errors,
        },
        requestId: request.id,
      };
    }

    if (!smtp.user || !smtp.pass || !contact.from || !contact.to) {
      request.log.error({ requestId: request.id }, "contact endpoint misconfigured");
      reply.code(500);
      return {
        success: false,
        error: {
          code: "misconfiguration",
          message: "Contact endpoint is not configured",
        },
        requestId: request.id,
      };
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
      connectionTimeout: contact.timeoutMs,
      greetingTimeout: contact.timeoutMs,
      socketTimeout: contact.timeoutMs,
    });

    const { html, text } = buildEmailContent(validated.data);

    try {
      await sendMailWithTimeout(
        transporter,
        {
          from: contact.from,
          to: contact.to,
          subject: `[Site LOCAMULTI] Nova mensagem de ${validated.data.name}`,
          text,
          html,
          replyTo: validated.data.email,
        },
        contact.timeoutMs
      );

      return { success: true, requestId: request.id };
    } catch (error) {
      request.log.error({ requestId: request.id, err: error }, "failed to send contact email");
      reply.code(502);
      return {
        success: false,
        error: {
          code: "email_send_failed",
          message: "Could not send email",
        },
        requestId: request.id,
      };
    }
  });
}
