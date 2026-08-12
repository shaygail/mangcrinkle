import { getProductById } from "@/data/products";
import {
  formatPackSelectionsSummary,
  getItemUnitPrice,
  getMilkLabel,
  isDrink,
  isPack,
  isPackSelectionsComplete,
  getPackSize,
  normalizeCartItem,
} from "@/lib/cart";
import {
  CartItem,
  MilkType,
  OrderCustomer,
  OrderItemPayload,
  OrderLine,
  OrderRequest,
  OrderSummary,
  Product,
} from "@/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function generateOrderId(): string {
  // Short 4-digit reference for emails and pickup (e.g. MC-4829)
  const num = Math.floor(1000 + Math.random() * 9000);
  return `MC-${num}`;
}

export function validateOrderRequest(body: unknown):
  | { ok: true; data: OrderRequest }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const raw = body as Record<string, unknown>;

  if (typeof raw.website === "string" && raw.website.trim()) {
    return { ok: false, error: "Invalid request." };
  }

  const customerRaw = raw.customer;
  if (!customerRaw || typeof customerRaw !== "object") {
    return { ok: false, error: "Customer details are required." };
  }

  const customerObj = customerRaw as Record<string, unknown>;
  const name = String(customerObj.name ?? "").trim();
  const email = String(customerObj.email ?? "").trim();
  const phone = String(customerObj.phone ?? "").trim();
  const notes = String(customerObj.notes ?? "").trim();

  if (!name || name.length < 2) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!phone || phone.length < 7) {
    return { ok: false, error: "Please enter a phone number." };
  }
  if (notes.length > 500) {
    return { ok: false, error: "Notes must be 500 characters or fewer." };
  }

  const itemsRaw = raw.items;
  if (!Array.isArray(itemsRaw) || itemsRaw.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }
  if (itemsRaw.length > 50) {
    return { ok: false, error: "Too many items in this order." };
  }

  const items: OrderItemPayload[] = [];
  for (const entry of itemsRaw) {
    if (!entry || typeof entry !== "object") {
      return { ok: false, error: "Invalid cart item." };
    }
    const item = entry as Record<string, unknown>;
    const productId = String(item.productId ?? "").trim();
    const quantity = Number(item.quantity);

    if (!productId) {
      return { ok: false, error: "Invalid cart item." };
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return { ok: false, error: "Invalid item quantity." };
    }

    const payload: OrderItemPayload = { productId, quantity };

    if (item.milk !== undefined) {
      const milk = String(item.milk) as MilkType;
      if (!["whole", "oat", "soy", "coconut", "almond"].includes(milk)) {
        return { ok: false, error: "Invalid milk selection." };
      }
      payload.milk = milk;
    }

    if (Array.isArray(item.packSelections)) {
      payload.packSelections = item.packSelections.map((id) => String(id));
    }

    items.push(payload);
  }

  const customer: OrderCustomer = { name, email, phone };
  if (notes) customer.notes = notes;

  return { ok: true, data: { customer, items } };
}

export function buildOrderSummary(
  products: Product[],
  request: OrderRequest,
  orderId: string
): OrderSummary | { error: string } {
  const lines: OrderLine[] = [];

  for (const payload of request.items) {
    const product = getProductById(products, payload.productId);
    if (!product) {
      return { error: `Unknown product: ${payload.productId}` };
    }

    let cartItem: CartItem;
    try {
      cartItem = normalizeCartItem({
        product,
        quantity: payload.quantity,
        milk: isDrink(product) ? (payload.milk ?? "whole") : undefined,
        packSelections: isPack(product) ? payload.packSelections : undefined,
      });
    } catch {
      return { error: `Invalid configuration for ${product.name}.` };
    }

    if (
      isPack(product) &&
      (!cartItem.packSelections ||
        !isPackSelectionsComplete(
          products,
          cartItem.packSelections,
          getPackSize(product)
        ))
    ) {
      return { error: `Incomplete pack selection for ${product.name}.` };
    }

    const unitPrice = getItemUnitPrice(products, cartItem);
    const line: OrderLine = {
      name: product.name,
      quantity: payload.quantity,
      unitPrice,
      lineTotal: unitPrice * payload.quantity,
    };

    if (cartItem.milk) {
      line.milk = getMilkLabel(cartItem.milk);
    }
    if (cartItem.packSelections?.length) {
      line.packSummary = formatPackSelectionsSummary(
        products,
        cartItem.packSelections
      );
    }

    lines.push(line);
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);

  return {
    orderId,
    customer: request.customer,
    lines,
    subtotal,
    createdAt: new Date().toISOString(),
  };
}

export function formatOrderEmailText(order: OrderSummary): string {
  const lines = order.lines
    .map((line) => {
      const parts = [
        `${line.quantity}× ${line.name} — $${line.lineTotal.toFixed(2)}`,
        line.milk ? `   Milk: ${line.milk}` : null,
        line.packSummary ? `   Crinkles: ${line.packSummary}` : null,
      ].filter(Boolean);
      return parts.join("\n");
    })
    .join("\n\n");

  const notes = order.customer.notes
    ? `\nNotes:\n${order.customer.notes}\n`
    : "";

  return [
    `New Mang Crinkle order — ${order.orderId}`,
    "",
    `Name:  ${order.customer.name}`,
    `Email: ${order.customer.email}`,
    `Phone: ${order.customer.phone}`,
    notes,
    "Items:",
    lines,
    "",
    `Subtotal: $${order.subtotal.toFixed(2)}`,
    "",
    `Placed: ${new Date(order.createdAt).toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" })}`,
  ].join("\n");
}

export function formatOrderEmailHtml(order: OrderSummary): string {
  const itemRows = order.lines
    .map((line) => {
      const extras = [
        line.milk ? `<div style="color:#666;font-size:13px;">Milk: ${escapeHtml(line.milk)}</div>` : "",
        line.packSummary
          ? `<div style="color:#666;font-size:13px;">Crinkles: ${escapeHtml(line.packSummary)}</div>`
          : "",
      ]
        .filter(Boolean)
        .join("");

      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(line.name)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${line.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">$${line.lineTotal.toFixed(2)}</td>
      </tr>
      ${extras ? `<tr><td colspan="3" style="padding:0 0 8px 0;border-bottom:1px solid #eee;">${extras}</td></tr>` : ""}`;
    })
    .join("");

  const notes = order.customer.notes
    ? `<p style="margin:16px 0;"><strong>Notes:</strong><br>${escapeHtml(order.customer.notes)}</p>`
    : "";

  return `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#3d2418;max-width:560px;margin:0 auto;padding:24px;">
  <h1 style="color:#3d2418;margin:0 0 8px;">New order — ${escapeHtml(order.orderId)}</h1>
  <p style="color:#666;margin:0 0 24px;">Mang Crinkle</p>
  <p><strong>Name:</strong> ${escapeHtml(order.customer.name)}<br>
  <strong>Email:</strong> ${escapeHtml(order.customer.email)}<br>
  <strong>Phone:</strong> ${escapeHtml(order.customer.phone)}</p>
  ${notes}
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <thead>
      <tr style="border-bottom:2px solid #3d2418;">
        <th style="text-align:left;padding:8px 0;">Item</th>
        <th style="text-align:center;padding:8px 0;">Qty</th>
        <th style="text-align:right;padding:8px 0;">Total</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>
  <p style="font-size:18px;font-weight:bold;text-align:right;">Subtotal: $${order.subtotal.toFixed(2)}</p>
  <p style="color:#666;font-size:13px;">Placed ${new Date(order.createdAt).toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" })}</p>
</body>
</html>`;
}

export function formatCustomerConfirmationText(order: OrderSummary): string {
  return [
    `Thanks for your order, ${order.customer.name}!`,
    "",
    `We've received your Mang Crinkle order (${order.orderId}).`,
    "We'll be in touch shortly to confirm pickup details.",
    "",
    `Subtotal: $${order.subtotal.toFixed(2)}`,
    "",
    "See you soon!",
    "— Mang Crinkle",
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
