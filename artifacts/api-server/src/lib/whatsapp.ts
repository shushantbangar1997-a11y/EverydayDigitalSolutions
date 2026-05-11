import { logger } from "./logger";

const CALLMEBOT_ENDPOINT = "https://api.callmebot.com/whatsapp.php";

/**
 * Send a WhatsApp message via CallMeBot.
 * Returns true on success. NEVER throws — caller must continue on failure.
 *
 * Requires env:
 *   CALLMEBOT_API_KEY  — issued by @CallMeBot to the recipient phone
 *   CALLMEBOT_PHONE    — recipient phone in international format, no `+` (e.g. 919056066006)
 */
export async function sendWhatsApp(message: string): Promise<boolean> {
  const apiKey = process.env["CALLMEBOT_API_KEY"];
  const phone = process.env["CALLMEBOT_PHONE"];

  if (!apiKey || !phone) {
    logger.warn(
      { hasApiKey: Boolean(apiKey), hasPhone: Boolean(phone) },
      "CallMeBot env not configured; skipping WhatsApp notification",
    );
    return false;
  }

  const url =
    `${CALLMEBOT_ENDPOINT}?phone=${encodeURIComponent(phone)}` +
    `&text=${encodeURIComponent(message)}` +
    `&apikey=${encodeURIComponent(apiKey)}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(url, { method: "GET", signal: controller.signal });
    clearTimeout(timer);

    const body = await res.text();
    const ok = res.ok && /Message queued|Message sent/i.test(body);

    if (!ok) {
      logger.warn(
        { status: res.status, body: body.slice(0, 300) },
        "CallMeBot returned non-success response",
      );
      return false;
    }

    logger.info("WhatsApp notification dispatched");
    return true;
  } catch (err) {
    logger.error({ err }, "CallMeBot request failed");
    return false;
  }
}

/** Format a lead into a concise WhatsApp message (under ~1000 chars). */
export function formatLeadMessage(lead: {
  name: string;
  businessName: string | null;
  whatsappNumber: string;
  email: string | null;
  city: string;
  industry: string;
  problem: string;
  goalIn3Months: string;
  budget: string;
  timeline: string;
}): string {
  const lines = [
    "NEW LEAD — everydaydigitalsolutions.com",
    "",
    `Name: ${lead.name}${lead.businessName ? ` (${lead.businessName})` : ""}`,
    `WhatsApp: ${lead.whatsappNumber}`,
  ];
  if (lead.email) lines.push(`Email: ${lead.email}`);
  lines.push(
    `City: ${lead.city}`,
    `Industry: ${lead.industry}`,
    `Budget: ${lead.budget}  |  Timeline: ${lead.timeline}`,
    "",
    `Problem: ${lead.problem.slice(0, 280)}`,
    "",
    `Goal (3 months): ${lead.goalIn3Months.slice(0, 200)}`,
  );
  return lines.join("\n");
}
