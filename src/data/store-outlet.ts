export interface StoreOutlet {
  name: string;
  cartLabel: string;
  hours: string;
  address: string;
  pickupNote: string;
  pickupWindows: string[];
}

export const DEFAULT_PICKUP_WINDOWS = [
  "10:00 - 10:30 AM",
  "11:00 - 11:30 AM",
  "12:00 - 12:30 PM",
  "1:30 - 2:00 PM",
  "3:30 - 4:00 PM",
  "5:00 - 5:30 PM",
  "6:30 - 7:00 PM",
] as const;

export const fallbackStoreOutlet: StoreOutlet = {
  name: "Manila Town Kitchen (HQ)",
  cartLabel: "Mang Crinkle HQ – Manila Town Kitchen",
  hours: "Open 10:00 AM – 8:00 PM Daily",
  address: "",
  pickupNote: "Arrive during this window for fresh & warm cookies.",
  pickupWindows: [...DEFAULT_PICKUP_WINDOWS],
};
