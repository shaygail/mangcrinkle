import { NextResponse } from "next/server";
import { sendOrderEmails, isEmailConfigured } from "@/lib/email";
import {
  buildOrderSummary,
  generateOrderId,
  validateOrderRequest,
} from "@/lib/order";
import { getProducts } from "@/lib/strapi";

export async function POST(request: Request) {
  if (!isEmailConfigured()) {
    return NextResponse.json(
      { error: "Order email is not configured yet. Please contact us directly." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validated = validateOrderRequest(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const products = await getProducts();
  const orderId = generateOrderId();
  const summary = buildOrderSummary(products, validated.data, orderId);

  if ("error" in summary) {
    return NextResponse.json({ error: summary.error }, { status: 400 });
  }

  const sent = await sendOrderEmails(summary);
  if (!sent.ok) {
    return NextResponse.json({ error: sent.error }, { status: 502 });
  }

  return NextResponse.json({
    success: true,
    orderId: summary.orderId,
    subtotal: summary.subtotal,
  });
}
