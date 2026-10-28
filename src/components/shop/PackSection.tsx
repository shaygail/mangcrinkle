"use client";

import { useRouter } from "next/navigation";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { isConfigurablePack } from "@/lib/cart";
import PackGridCard from "./PackGridCard";

interface PackSectionProps {
  packs: Product[];
  onAdded?: (name: string) => void;
}

export default function PackSection({ packs, onAdded }: PackSectionProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
      {packs.map((pack) =>
        isConfigurablePack(pack) ? (
          <PackGridCard
            key={pack.id}
            pack={pack}
            isActive={false}
            onChoose={() => router.push(`/shop/build/${pack.id}`)}
          />
        ) : (
          <ProductCard key={pack.id} product={pack} onAdded={onAdded} />
        )
      )}
    </div>
  );
}
