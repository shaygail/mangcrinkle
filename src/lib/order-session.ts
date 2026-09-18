import type { CheckoutSuccessMeta } from "@/components/CheckoutForm";
import { DEFAULT_PICKUP_WINDOWS } from "@/data/store-outlet";

/** @deprecated Prefer Store Outlet CMS pickupWindows; kept as offline default */
export const PICKUP_TIMES = DEFAULT_PICKUP_WINDOWS;

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

function defaultTime(windows: string[]) {
  if (windows.length === 0) return DEFAULT_PICKUP_WINDOWS[4];
  return windows[Math.min(4, windows.length - 1)] ?? windows[0];
}

export function defaultPickupSession(
  windows: string[] = [...DEFAULT_PICKUP_WINDOWS]
): PickupSession {
  const time = defaultTime(windows);
  return {
    dayOffset: 0,
    time,
    summary: buildPickupSummary(0, time),
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

export function loadPickupSession(
  windows: string[] = [...DEFAULT_PICKUP_WINDOWS]
): PickupSession {
  const defaults = defaultPickupSession(windows);
  try {
    const raw = sessionStorage.getItem(PICKUP_KEY);
    if (!raw) return defaults;
    const parsed = { ...defaults, ...(JSON.parse(raw) as PickupSession) };
    if (windows.length > 0 && !windows.includes(parsed.time)) {
      parsed.time = defaults.time;
      parsed.summary = buildPickupSummary(parsed.dayOffset, parsed.time);
    }
    return parsed;
  } catch {
    return defaults;
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
