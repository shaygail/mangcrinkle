"use client";

import { useRouter } from "next/navigation";
import { Product } from "@/types";
import PackGridCard from "./PackGridCard";

interface PackSectionProps {
  packs: Product[];
  onAdded?: (name: string) => void;
}

export default function PackSection({ packs }: PackSectionProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
      {packs.map((pack) => (
        <PackGridCard
          key={pack.id}
          pack={pack}
          isActive={false}
          onChoose={() => router.push(`/shop/build/${pack.id}`)}
        />
      ))}
    </div>
  );
}
