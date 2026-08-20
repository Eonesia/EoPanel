import { Router } from "express";

export const integrationsRouter = Router();

const GMAIL_SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

function configured(...vars: (string | undefined)[]) {
  return vars.every((v) => Boolean(v && v.trim()));
}

/**
 * Este endpoint devuelve HTML construido con `res.send()` a partir de parámetros
 * de la query string (que un atacante controla llamando a la URL directamente,
 * sin pasar por Google) — hay que escapar antes de interpolar para evitar XSS reflejado.
 */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Estado agregado de cada integración externa — el frontend podrá consumir esto
 *  para sustituir las tarjetas "no conectado" por el estado real. */
integrationsRouter.get("/status", (_req, res) => {
  res.json({
    gmail: { configured: configured(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET) },
    meta: { configured: configured(process.env.META_APP_ID, process.env.META_APP_SECRET) },
    linkedin: { configured: configured(process.env.LINKEDIN_CLIENT_ID, process.env.LINKEDIN_CLIENT_SECRET) },
    tiktok: { configured: configured(process.env.TIKTOK_CLIENT_KEY, process.env.TIKTOK_CLIENT_SECRET) },
    ga4: { configured: configured(process.env.GA4_PROPERTY_ID, process.env.GA4_SERVICE_ACCOUNT_JSON) },
    openBanking: { configured: configured(process.env.OPEN_BANKING_PROVIDER, process.env.OPEN_BANKING_API_KEY) },
    lxp: { configured: configured(process.env.LXP_CONNECTION_MODE, process.env.LXP_DATABASE_URL) },
  });
});

/** Arranca el flujo OAuth de Gmail. Redirige a Google si hay credenciales; si no, explica qué falta. */
integrationsRouter.get("/gmail/oauth/start", (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    res.status(503).json({
      error: "gmail_not_configured",
      message: "Faltan GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET en apps/api/.env — ver .env.example.",
    });
    return;
  }

  const redirectUri = `${req.protocol}://${req.get("host")}/api/integrations/gmail/oauth/callback`;
  const account = typeof req.query.account === "string" ? req.query.account : "info";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: GMAIL_SCOPES.join(" "),
    state: account,
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

/**
 * Callback de Google tras autorizar. Con credenciales reales, aquí se intercambiaría
 * el `code` por tokens (access + refresh) y se guardarían asociados a la cuenta de
 * correo en Supabase. Pendiente hasta tener el proyecto Supabase conectado — de
 * momento confirma que el flujo llega correctamente hasta el final.
 */
integrationsRouter.get("/gmail/oauth/callback", async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const { code, state, error } = req.query;

  if (error) {
    res.status(400).send(`Autorización cancelada o denegada: ${escapeHtml(String(error))}`);
    return;
  }
  if (!clientId || !clientSecret || !code) {
    res.status(503).send("Faltan credenciales de Google o código de autorización.");
    return;
  }

  // TODO: intercambiar `code` por tokens en https://oauth2.googleapis.com/token
  // y persistir { account: state, access_token, refresh_token, expiry } en Supabase
  // (tabla a definir, p.ej. mail_accounts) una vez el proyecto esté conectado.
  res.send(
    `<p>Autorización recibida para la cuenta <b>${escapeHtml(String(state))}</b>. Falta implementar el intercambio de token y su persistencia — ver TODO en apps/api/src/routes/integrations.ts.</p>`,
  );
});
