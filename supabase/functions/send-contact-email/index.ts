import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  company?: string;
  phone: string;
  email: string;
  category?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, company, phone, email, category, message }: ContactEmailRequest = await req.json();

    console.log("Recebendo solicitação de contato de:", name, email);

    // Configuração SMTP Hostinger
    const smtpHost = Deno.env.get("SMTP_HOST") || "smtp.hostinger.com";
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "465");
    const smtpUser = Deno.env.get("SMTP_USER") || "atendimento@locamulti.com.br";
    const smtpPass = Deno.env.get("SMTP_PASS");

    if (!smtpPass) {
      console.error("SMTP_PASS não configurado");
      throw new Error("Configuração de email incompleta. Contate o administrador.");
    }

    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: true,
        auth: {
          username: smtpUser,
          password: smtpPass,
        },
      },
    });

    const now = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    
    const htmlContent = `
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
      <p>LOCAMULTI - Locação de Equipamentos</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">📅 Data/Hora:</div>
        <div class="value">${now}</div>
      </div>
      <div class="field">
        <div class="label">👤 Nome:</div>
        <div class="value">${name}</div>
      </div>
      ${company ? `
      <div class="field">
        <div class="label">🏢 Empresa:</div>
        <div class="value">${company}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="label">📞 Telefone:</div>
        <div class="value">${phone}</div>
      </div>
      <div class="field">
        <div class="label">📧 E-mail:</div>
        <div class="value"><a href="mailto:${email}">${email}</a></div>
      </div>
      ${category ? `
      <div class="field">
        <div class="label">📋 Categoria de Interesse:</div>
        <div class="value">${category}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="label">💬 Mensagem:</div>
        <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      <p>Este email foi enviado automaticamente pelo formulário de contato do site LOCAMULTI.</p>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
Nova mensagem do site LOCAMULTI
================================

Data/Hora: ${now}
Nome: ${name}
${company ? `Empresa: ${company}\n` : ''}Telefone: ${phone}
E-mail: ${email}
${category ? `Categoria: ${category}\n` : ''}
Mensagem:
${message}

---
Email automático do formulário de contato do site LOCAMULTI.
    `;

    await client.send({
      from: smtpUser,
      to: "atendimento@locamulti.com.br",
      subject: `[Site LOCAMULTI] Nova mensagem de ${name}`,
      content: textContent,
      html: htmlContent,
    });

    await client.close();

    console.log("Email enviado com sucesso para atendimento@locamulti.com.br");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro na função send-contact-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
