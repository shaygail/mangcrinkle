"use client";

import { Product } from "@/types";
import { getCrinkleFlavours } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import {
  calculatePackUnitPrice,
  getPackSize,
  PREMIUM_UPGRADE,
  SIGNATURE_UPGRADE,
} from "@/lib/cart";

interface PackSelectionsEditorProps {
  pack: Product;
  selections: string[];
  onChange: (selections: string[]) => void;
  compact?: boolean;
}

function upgradeLabel(category: Product["category"]): string {
  if (category === "crinkle-premium") return `(+$${PREMIUM_UPGRADE.toFixed(2)})`;
  if (category === "crinkle-signature")
    return `(+$${SIGNATURE_UPGRADE.toFixed(2)})`;
  return "";
}

export default function PackSelectionsEditor({
  pack,
  selections,
  onChange,
  compact = false,
}: PackSelectionsEditorProps) {
  const { products } = useProducts();
  const packSize = getPackSize(pack);
  const crinkleFlavours = getCrinkleFlavours(products);

  const updateSlot = (index: number, crinkleId: string) => {
    const next = [...selections];
    next[index] = crinkleId;
    onChange(next);
  };

  const grouped = [
    {
      label: "Standard",
      items: crinkleFlavours.filter((c) => c.category === "crinkle-standard"),
    },
    {
      label: "Premium",
      items: crinkleFlavours.filter((c) => c.category === "crinkle-premium"),
    },
    {
      label: "Signature",
      items: crinkleFlavours.filter((c) => c.category === "crinkle-signature"),
    },
  ];

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {!compact && (
        <p className="text-xs text-mang-brown/70 font-serif italic">
          Pick {packSize} crinkles. Premium +${PREMIUM_UPGRADE.toFixed(2)}, Signature
          +${SIGNATURE_UPGRADE.toFixed(2)} each.
        </p>
      )}

      {selections.map((selectedId, index) => (
        <div key={index}>
          <label
            htmlFor={`pack-slot-${pack.id}-${index}`}
            className="text-[10px] font-bold uppercase tracking-wider text-mang-brown/60 block mb-1"
          >
            Crinkle {index + 1}
          </label>
          <select
            id={`pack-slot-${pack.id}-${index}`}
            value={selectedId}
            onChange={(e) => updateSlot(index, e.target.value)}
            className="w-full text-xs bg-mang-cream border border-mang-brown/25 rounded-lg px-2 py-1.5 text-mang-brown focus:outline-none focus:border-mang-orange"
          >
            {grouped.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.items.map((crinkle) => (
                  <option key={crinkle.id} value={crinkle.id}>
                    {crinkle.name} {upgradeLabel(crinkle.category)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      ))}

      <p className="text-sm font-bold text-mang-orange pt-1">
        Pack total: $
        {calculatePackUnitPrice(products, pack, selections).toFixed(2)}
      </p>
    </div>
  );
}
