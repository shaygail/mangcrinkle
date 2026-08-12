import { Resend } from "resend";
import {
  formatCustomerConfirmationText,
  formatOrderEmailHtml,
  formatOrderEmailText,
} from "@/lib/order";
import { OrderSummary } from "@/types";

const TEST_SENDER = "Mang Crinkle <onboarding@resend.dev>";

function getEmailConfig() {
  const to = process.env.ORDER_EMAIL_TO;
  const replyTo = process.env.ORDER_EMAIL_REPLY_TO ?? to;
  const ownerFrom = process.env.ORDER_EMAIL_FROM ?? TEST_SENDER;
  const customerFrom =
    process.env.ORDER_EMAIL_FROM_CUSTOMER ?? ownerFrom ?? TEST_SENDER;

  return {
    apiKey: process.env.RESEND_API_KEY,
    to,
    replyTo,
    ownerFrom,
    customerFrom,
  };
}

export function isEmailConfigured(): boolean {
  const { apiKey, to } = getEmailConfig();
  return Boolean(apiKey && to);
}

export async function sendOrderEmails(
  order: OrderSummary
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { apiKey, to, replyTo, ownerFrom, customerFrom } = getEmailConfig();

  if (!apiKey || !to) {
    console.error("Email not configured: RESEND_API_KEY and ORDER_EMAIL_TO required.");
    return { ok: false, error: "Order email is not configured yet. Please try again later." };
  }

  const resend = new Resend(apiKey);

  const ownerResult = await resend.emails.send({
    from: ownerFrom,
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
    from: customerFrom,
    to: [order.customer.email],
    replyTo: replyTo ?? undefined,
    subject: `Order received — ${order.orderId}`,
    text: formatCustomerConfirmationText(order),
  });

  if (customerResult.error) {
    console.error("Failed to send customer confirmation:", customerResult.error);
    // Owner email succeeded — don't fail the order for confirmation-only failure
  }

  return { ok: true };
}
