import { Resend } from "resend";
import {
  formatCustomerConfirmationText,
  formatOrderEmailHtml,
  formatOrderEmailText,
} from "@/lib/order";
import { OrderSummary } from "@/types";

function getEmailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    to: process.env.ORDER_EMAIL_TO,
    from: process.env.ORDER_EMAIL_FROM ?? "Mang Crinkle <onboarding@resend.dev>",
  };
}

export function isEmailConfigured(): boolean {
  const { apiKey, to } = getEmailConfig();
  return Boolean(apiKey && to);
}

export async function sendOrderEmails(
  order: OrderSummary
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { apiKey, to, from } = getEmailConfig();

  if (!apiKey || !to) {
    console.error("Email not configured: RESEND_API_KEY and ORDER_EMAIL_TO required.");
    return { ok: false, error: "Order email is not configured yet. Please try again later." };
  }

  const resend = new Resend(apiKey);

  const ownerResult = await resend.emails.send({
    from,
    to: [to],
    replyTo: order.customer.email,
    subject: `New order ${order.orderId} — ${order.customer.name}`,
    text: formatOrderEmailText(order),
    html: formatOrderEmailHtml(order),
  });

  if (ownerResult.error) {
    console.error("Failed to send order notification:", ownerResult.error);
    return { ok: false, error: "Could not send your order. Please try again." };
  }

  const customerResult = await resend.emails.send({
    from,
    to: [order.customer.email],
    subject: `Order received — ${order.orderId}`,
    text: formatCustomerConfirmationText(order),
  });

  if (customerResult.error) {
    console.error("Failed to send customer confirmation:", customerResult.error);
    // Owner email succeeded — don't fail the order for confirmation-only failure
  }

  return { ok: true };
}
