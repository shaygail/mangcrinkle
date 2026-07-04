"use client";

import { useState } from "react";
import { Product } from "@/types";
import PackGridCard from "./PackGridCard";
import PackExpandedPanel from "./PackExpandedPanel";

interface PackSectionProps {
  packs: Product[];
  onAdded?: (name: string) => void;
}

export default function PackSection({ packs, onAdded }: PackSectionProps) {
  const [expandedPackId, setExpandedPackId] = useState<string | null>(null);
  const expandedPack = packs.find((p) => p.id === expandedPackId) ?? null;

  const togglePack = (packId: string) => {
    setExpandedPackId((current) => (current === packId ? null : packId));
  };

  const handleAdded = (name: string) => {
    setExpandedPackId(null);
    onAdded?.(name);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {packs.map((pack) => (
          <PackGridCard
            key={pack.id}
            pack={pack}
            isActive={expandedPackId === pack.id}
            onChoose={() => togglePack(pack.id)}
          />
        ))}
      </div>

      {expandedPack && (
        <PackExpandedPanel
          pack={expandedPack}
          onClose={() => setExpandedPackId(null)}
          onAdded={handleAdded}
        />
      )}
    </>
  );
}
