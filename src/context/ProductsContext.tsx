"use client";

import { createContext, useContext, ReactNode } from "react";
import { Product } from "@/types";

interface ProductsContextType {
  products: Product[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export function ProductsProvider({
  initialProducts,
  children,
}: {
  initialProducts: Product[];
  children: ReactNode;
}) {
  return (
    <ProductsContext.Provider value={{ products: initialProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
