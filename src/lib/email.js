/**
 * Transactional email through Resend's HTTP API.
 *
 * Plain `fetch` rather than the SDK: two sends from one route do not justify a
 * dependency. Server-only — this reads the API key and must never be imported
 * into a client component.
 *
 * ENV (see .env.local, which is git-ignored):
 *   RESEND_API_KEY  send-only key from the Resend dashboard
 *   CONTACT_FROM    "Name <address>" on a domain verified in Resend, or
 *                   Resend's testing sender onboarding@resend.dev
 *   CONTACT_TO      inbox that receives new enquiries
 */

const RESEND_URL = "https://api.resend.com/emails";

/* Resend's shared testing sender, used until a domain of the centre's own is
   verified in Resend. A gmail.com address can never be the sender. NOTE: the
   testing sender only delivers to the email address that owns the Resend
   account — see the acknowledgement note in api/contact/route.js. */
const DEFAULT_FROM = "Vidyanjali Learning Centre <onboarding@resend.dev>";
const DEFAULT_TO = "vidyanjalitherapycentre2112@gmail.com";

export const emailConfig = {
  from: process.env.CONTACT_FROM || DEFAULT_FROM,
  to: process.env.CONTACT_TO || DEFAULT_TO,
};

/**
 * Sends one email. Resolves to Resend's response body (`{ id }`), or throws
 * with Resend's own error message so the route can log something useful.
 */
export async function sendEmail({ to, subject, html, text, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: emailConfig.from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: Array.isArray(replyTo) ? replyTo : [replyTo] } : {}),
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${body?.message || "send failed"}`);
  }
  return body;
}

/** Escapes user input for interpolation into an HTML email. */
export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
