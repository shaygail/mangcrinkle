"use client";

import { FormEvent, useState } from "react";
import { useCart } from "@/context/CartContext";
import { isDrink, isPack } from "@/lib/cart";
import { OrderItemPayload } from "@/types";
import Button from "@/components/Button";

interface CheckoutFormProps {
  onBack: () => void;
  onSuccess: (orderId: string) => void;
}

export default function CheckoutForm({ onBack, onSuccess }: CheckoutFormProps) {
  const { items, subtotal, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      customer: { name, email, phone, notes: notes || undefined },
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
      onSuccess(data.orderId);
    } catch {
      setError("Could not reach the server. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-mang-brown/70 mb-4">
          Enter your details and we&apos;ll confirm pickup by email.
        </p>
      </div>

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

      <div>
        <label
          htmlFor="checkout-name"
          className="block text-xs font-bold uppercase tracking-wider text-mang-brown/60 mb-1"
        >
          Name
        </label>
        <input
          id="checkout-name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full min-h-11 bg-mang-cream border border-mang-brown/25 rounded-xl px-3 py-3 text-base text-mang-brown focus:outline-none focus:border-mang-orange"
        />
      </div>

      <div>
        <label
          htmlFor="checkout-email"
          className="block text-xs font-bold uppercase tracking-wider text-mang-brown/60 mb-1"
        >
          Email
        </label>
        <input
          id="checkout-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-h-11 bg-mang-cream border border-mang-brown/25 rounded-xl px-3 py-3 text-base text-mang-brown focus:outline-none focus:border-mang-orange"
        />
      </div>

      <div>
        <label
          htmlFor="checkout-phone"
          className="block text-xs font-bold uppercase tracking-wider text-mang-brown/60 mb-1"
        >
          Phone
        </label>
        <input
          id="checkout-phone"
          type="tel"
          required
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full min-h-11 bg-mang-cream border border-mang-brown/25 rounded-xl px-3 py-3 text-base text-mang-brown focus:outline-none focus:border-mang-orange"
        />
      </div>

      <div>
        <label
          htmlFor="checkout-notes"
          className="block text-xs font-bold uppercase tracking-wider text-mang-brown/60 mb-1"
        >
          Pickup notes <span className="font-normal normal-case">(optional)</span>
        </label>
        <textarea
          id="checkout-notes"
          rows={3}
          maxLength={500}
          placeholder="Preferred pickup time, dietary notes, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full min-h-11 bg-mang-cream border border-mang-brown/25 rounded-xl px-3 py-3 text-base text-mang-brown focus:outline-none focus:border-mang-orange resize-none"
        />
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-mang-brown/10">
        <span className="font-bold text-mang-brown">Subtotal</span>
        <span className="menu-price text-xl">${subtotal.toFixed(2)}</span>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="brown"
        fullWidth
        disabled={submitting}
      >
        {submitting ? "Sending order…" : "Place Order"}
      </Button>

      <button
        type="button"
        onClick={onBack}
        disabled={submitting}
        className="w-full min-h-11 text-center text-sm text-mang-brown/60 hover:text-mang-brown underline disabled:opacity-50 py-3"
      >
        Back to cart
      </button>
    </form>
  );
}
