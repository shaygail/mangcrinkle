"use client";

import { FormEvent, useState } from "react";
import { useCart } from "@/context/CartContext";
import { getItemUnitPrice, isDrink, isPack } from "@/lib/cart";
import { useProducts } from "@/context/ProductsContext";
import { OrderItemPayload } from "@/types";
import Button from "@/components/Button";

export type CheckoutSuccessMeta = {
  lines: { name: string; qty: number; total: number }[];
  subtotal: number;
  pickup: string;
  payment: string;
};

interface CheckoutFormProps {
  onBack: () => void;
  onSuccess: (orderId: string, meta: CheckoutSuccessMeta) => void;
  pickupSummary: string;
  submitLabel?: string;
  outletName?: string;
}

type PaymentMethod = "gcash" | "card" | "pickup";

export default function CheckoutForm({
  onBack,
  onSuccess,
  pickupSummary,
  submitLabel = "Place Order",
  outletName = "Manila Town Kitchen (HQ)",
}: CheckoutFormProps) {
  const { products } = useProducts();
  const { items, subtotal, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("pickup");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const paymentLabel =
    payment === "gcash"
      ? "Preferred: GCash / Mobile Wallet (pay at pickup)"
      : payment === "card"
        ? "Preferred: Card (pay at pickup)"
        : "Pay at pickup";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const scheduleNote = `Pickup: ${pickupSummary} · ${paymentLabel}`;
    const combinedNotes = [scheduleNote, notes.trim()].filter(Boolean).join("\n");

    const lines = items.map((item) => ({
      name: item.product.name,
      qty: item.quantity,
      total: getItemUnitPrice(products, item) * item.quantity,
    }));

    const payload = {
      customer: {
        name,
        email,
        phone,
        notes: combinedNotes || undefined,
      },
      website,
      items: items.map(
        (item): OrderItemPayload => ({
          productId: item.product.id,
          quantity: item.quantity,
          ...(isDrink(item.product) && item.milk ? { milk: item.milk } : {}),
          ...(isPack(item.product) && item.packSelections
            ? { packSelections: item.packSelections }
            : {}),
        })
      ),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        success?: boolean;
        orderId?: string;
        error?: string;
      };

      if (!res.ok || !data.success || !data.orderId) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      clearCart();
      onSuccess(data.orderId, {
        lines,
        subtotal,
        pickup: pickupSummary,
        payment: paymentLabel,
      });
    } catch {
      setError("Could not reach the server. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  const fieldClass =
    "w-full min-h-11 bg-white border-[1.5px] border-mang-brown rounded-lg px-4 py-3 text-sm text-mang-brown focus:outline-none focus:ring-2 focus:ring-mang-orange/40";
  const labelClass =
    "block text-[12px] font-extrabold uppercase tracking-wide text-mang-brown-mid mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <section className="space-y-3">
        <h3 className="menu-title-3d text-xl">1. Contact Information</h3>
        <div className="bg-mang-cream border-2 border-mang-brown rounded-2xl p-4 sm:p-5 space-y-4 shadow-[3px_3px_0_rgba(61,36,23,0.12)]">
          <div>
            <label htmlFor="checkout-name" className={labelClass}>
              Full Name *
            </label>
            <input
              id="checkout-name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="checkout-email" className={labelClass}>
              Email Address *
            </label>
            <input
              id="checkout-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label htmlFor="checkout-phone" className={labelClass + " mb-0"}>
                Mobile Number *
              </label>
              {phone.trim().length >= 8 && (
                <span className="text-[10px] font-bold text-mang-brown">
                  ✓ Valid for SMS notifications
                </span>
              )}
            </div>
            <input
              id="checkout-phone"
              type="tel"
              required
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="checkout-notes" className={labelClass}>
              Extra Notes{" "}
              <span className="font-normal normal-case">(optional)</span>
            </label>
            <textarea
              id="checkout-notes"
              rows={2}
              maxLength={500}
              placeholder="Dietary notes, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={fieldClass + " resize-none"}
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="menu-title-3d text-xl">2. Pickup Schedule</h3>
        <div className="bg-mang-cream border-2 border-mang-brown rounded-2xl p-4 shadow-[3px_3px_0_rgba(61,36,23,0.12)] space-y-1">
          <p className="font-bold text-sm text-mang-brown">
            📍 {outletName}
          </p>
          <p className="text-sm text-mang-brown-mid">Date: {pickupSummary}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="menu-title-3d text-xl">3. Payment Preference</h3>
        <p className="text-xs text-mang-brown-mid -mt-1">
          Orders are confirmed by email — payment is collected at pickup.
        </p>
        <div className="space-y-2">
          {(
            [
              {
                id: "pickup" as const,
                title: "Pay at Pickup",
                desc: "Cash or card when you collect your box",
                icon: "🍪",
              },
              {
                id: "gcash" as const,
                title: "GCash / Mobile Wallet",
                desc: "Prefer to settle via mobile wallet at pickup",
                icon: "📱",
              },
              {
                id: "card" as const,
                title: "Credit or Debit Card",
                desc: "Visa, Mastercard, and JCB at pickup",
                icon: "💳",
              },
            ] as const
          ).map((opt) => {
            const selected = payment === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPayment(opt.id)}
                className={`w-full flex items-center justify-between gap-3 p-4 rounded-xl text-left transition-colors ${
                  selected
                    ? "bg-mang-cream border-[3px] border-mang-brown shadow-[3px_3px_0_rgba(61,36,23,0.12)]"
                    : "bg-mang-cream-light border-[1.5px] border-mang-brown"
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      selected
                        ? "border-mang-brown bg-mang-brown"
                        : "border-mang-brown"
                    }`}
                    aria-hidden
                  >
                    {selected && (
                      <span className="size-1.5 rounded-full bg-mang-cream" />
                    )}
                  </span>
                  <span>
                    <span className="block font-bold text-sm text-mang-brown">
                      {opt.title}
                    </span>
                    <span className="block text-xs text-mang-brown-mid">
                      {opt.desc}
                    </span>
                  </span>
                </span>
                <span className="text-xl shrink-0" aria-hidden>
                  {opt.icon}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-mang-cream border-2 border-mang-brown rounded-2xl p-5 space-y-3 shadow-[3px_3px_0_rgba(61,36,23,0.12)]">
        <h3 className="menu-title-3d text-xl">4. Order Summary</h3>
        <ul className="space-y-1.5 text-sm text-mang-brown">
          {items.map((item) => (
            <li
              key={item.lineId}
              className="flex justify-between gap-3"
            >
              <span>
                {item.product.name} (Qty: {item.quantity})
              </span>
              <span className="font-bold shrink-0">
                $
                {(
                  getItemUnitPrice(products, item) * item.quantity
                ).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t border-dashed border-mang-brown/30 pt-3 flex justify-between items-center">
          <span className="menu-title-3d text-lg">Total Charged</span>
          <span className="font-extrabold text-xl text-mang-brown">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="yellow"
          pop
          fullWidth
          disabled={submitting}
        >
          {submitting
            ? "Sending order…"
            : `🔒 ${submitLabel} • $${subtotal.toFixed(2)}`}
        </Button>
      </section>

      <button
        type="button"
        onClick={onBack}
        disabled={submitting}
        className="w-full min-h-11 text-center text-sm text-mang-brown/60 hover:text-mang-brown underline disabled:opacity-50 py-3"
      >
        Back to box
      </button>
    </form>
  );
}
