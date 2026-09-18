import type { CheckoutSuccessMeta } from "@/components/CheckoutForm";

export const PICKUP_TIMES = [
  "10:00 - 10:30 AM",
  "11:00 - 11:30 AM",
  "12:00 - 12:30 PM",
  "1:30 - 2:00 PM",
  "3:30 - 4:00 PM",
  "5:00 - 5:30 PM",
  "6:30 - 7:00 PM",
] as const;

export type PickupSession = {
  dayOffset: number;
  time: string;
  summary: string;
  promo: string;
};

export type OrderConfirmSession = CheckoutSuccessMeta & {
  orderId: string;
};

const PICKUP_KEY = "mang-crinkle-pickup";
const ORDER_KEY = "mang-crinkle-order-confirm";

export function formatPickupDate(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  if (offsetDays === 0) {
    return `Today, ${d.toLocaleDateString("en-NZ", { month: "short", day: "numeric" })}`;
  }
  if (offsetDays === 1) {
    return `Tomorrow, ${d.toLocaleDateString("en-NZ", { month: "short", day: "numeric" })}`;
  }
  return d.toLocaleDateString("en-NZ", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function buildPickupSummary(dayOffset: number, time: string) {
  return `${formatPickupDate(dayOffset)} @ ${time}`;
}

export function defaultPickupSession(): PickupSession {
  return {
    dayOffset: 0,
    time: PICKUP_TIMES[4],
    summary: buildPickupSummary(0, PICKUP_TIMES[4]),
    promo: "",
  };
}

export function savePickupSession(session: PickupSession) {
  try {
    sessionStorage.setItem(PICKUP_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function loadPickupSession(): PickupSession {
  try {
    const raw = sessionStorage.getItem(PICKUP_KEY);
    if (!raw) return defaultPickupSession();
    return { ...defaultPickupSession(), ...(JSON.parse(raw) as PickupSession) };
  } catch {
    return defaultPickupSession();
  }
}

export function saveOrderConfirm(session: OrderConfirmSession) {
  try {
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function loadOrderConfirm(): OrderConfirmSession | null {
  try {
    const raw = sessionStorage.getItem(ORDER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OrderConfirmSession;
  } catch {
    return null;
  }
}
