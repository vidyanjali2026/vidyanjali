import { NextResponse } from "next/server";
import { emailConfig, escapeHtml, sendEmail } from "@/lib/email";

/**
 * Contact form submissions.
 *
 * Two emails per enquiry:
 *   1. the ENQUIRY, to the centre's inbox (CONTACT_TO), with Reply-To set to
 *      the parent so the centre can answer straight from their mail client;
 *   2. an ACKNOWLEDGEMENT to the parent, confirming receipt and echoing back
 *      what they sent.
 *
 * The enquiry is the one that matters: if it fails the request fails and the
 * form shows an error, so nothing is silently lost. The acknowledgement is a
 * courtesy — if it fails (a mistyped address, say) the enquiry has still
 * arrived, so it is logged and the parent still sees success.
 *
 * WHILE THE SENDER IS onboarding@resend.dev, Resend delivers only to the
 * address that owns the Resend account, so the acknowledgement to parents is
 * rejected (and logged) until the centre's own domain is verified. The
 * enquiry to CONTACT_TO still arrives if that inbox owns the account.
 *
 * The acknowledgement wording promises only that the enquiry was received
 * and will be answered. Add response times or next steps only once the
 * client has confirmed them.
 */

const FIELDS = [
  ["parentName", "Parent name"],
  ["email", "Email"],
  ["phone", "Phone number"],
  ["childName", "Child name"],
  ["dob", "Child's date of birth"],
  ["reason", "Reason for enquiry"],
];

/* Generous but bounded, so the endpoint cannot be used to mail out essays. */
const MAX_LENGTH = { reason: 5000, default: 200 };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(data) {
  const out = {};
  for (const [key] of FIELDS) {
    const limit = MAX_LENGTH[key] ?? MAX_LENGTH.default;
    out[key] = String(data?.[key] ?? "").trim().slice(0, limit);
  }
  return out;
}

function detailsTable(entry) {
  const rows = FIELDS.filter(([key]) => entry[key])
    .map(
      ([key, label]) => `
        <tr>
          <td style="padding:8px 16px 8px 0;color:#6a6275;vertical-align:top;white-space:nowrap;">${label}</td>
          <td style="padding:8px 0;color:#42206e;white-space:pre-wrap;">${escapeHtml(entry[key])}</td>
        </tr>`,
    )
    .join("");
  return `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:15px;line-height:1.5;">${rows}</table>`;
}

function detailsText(entry) {
  return FIELDS.filter(([key]) => entry[key])
    .map(([key, label]) => `${label}: ${entry[key]}`)
    .join("\n");
}

function layout(inner) {
  return `<!doctype html>
<html><body style="margin:0;background:#fbf6ec;font-family:Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <p style="margin:0 0 24px;font-size:20px;color:#42206e;font-family:Georgia,serif;">Vidyanjali Learning Centre</p>
    <div style="background:#ffffff;border-radius:16px;padding:28px 24px;color:#4e4557;font-size:15px;line-height:1.6;">
      ${inner}
    </div>
  </div>
</body></html>`;
}

function enquiryEmail(entry) {
  return {
    to: emailConfig.to,
    replyTo: entry.email,
    subject: `New enquiry from ${entry.parentName}`,
    html: layout(`
      <p style="margin:0 0 16px;color:#42206e;font-size:17px;"><strong>New enquiry from the website</strong></p>
      ${detailsTable(entry)}
      <p style="margin:24px 0 0;color:#6a6275;font-size:13px;">Reply to this email to answer ${escapeHtml(entry.parentName)} directly.</p>`),
    text: `New enquiry from the website\n\n${detailsText(entry)}\n\nReply to this email to answer ${entry.parentName} directly.`,
  };
}

function acknowledgementEmail(entry) {
  return {
    to: entry.email,
    replyTo: emailConfig.to,
    subject: "We've received your enquiry — Vidyanjali Learning Centre",
    html: layout(`
      <p style="margin:0 0 16px;">Dear ${escapeHtml(entry.parentName)},</p>
      <p style="margin:0 0 16px;">Thank you for contacting Vidyanjali Learning Centre. We have received your enquiry and a member of our team will get back to you.</p>
      <p style="margin:0 0 12px;">For your reference, this is what you sent us:</p>
      ${detailsTable(entry)}
      <p style="margin:24px 0 0;">If anything has changed, simply reply to this email.</p>
      <p style="margin:16px 0 0;">Warm regards,<br/>Vidyanjali Learning Centre</p>`),
    text: `Dear ${entry.parentName},\n\nThank you for contacting Vidyanjali Learning Centre. We have received your enquiry and a member of our team will get back to you.\n\nFor your reference, this is what you sent us:\n\n${detailsText(entry)}\n\nIf anything has changed, simply reply to this email.\n\nWarm regards,\nVidyanjali Learning Centre`,
  };
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  /* Honeypot: a field hidden from people but filled in by most bots. Answer
     as if it worked, so the bot learns nothing, and send nothing. */
  if (data?.website) {
    return NextResponse.json({ ok: true });
  }

  const entry = clean(data);

  if (!entry.parentName || !entry.email) {
    return NextResponse.json(
      { error: "Please provide your name and email." },
      { status: 400 },
    );
  }

  if (!EMAIL_PATTERN.test(entry.email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    await sendEmail(enquiryEmail(entry));
  } catch (err) {
    console.error("Contact enquiry email failed:", err);
    return NextResponse.json(
      { error: "Sorry, we couldn't send your enquiry just now. Please try again shortly." },
      { status: 502 },
    );
  }

  try {
    await sendEmail(acknowledgementEmail(entry));
  } catch (err) {
    console.error("Contact acknowledgement email failed:", err);
  }

  return NextResponse.json({ ok: true });
}
