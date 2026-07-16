"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Product, CartItem, MilkType } from "@/types";
import {
  getCartLineId,
  getItemUnitPrice,
  getPackSize,
  isDrink,
  isPack,
  isPackSelectionsComplete,
  normalizeCartItem,
} from "@/lib/cart";
import { useProducts } from "@/context/ProductsContext";

export interface AddItemOptions {
  packSelections?: string[];
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number, options?: AddItemOptions) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  updateMilk: (lineId: string, milk: MilkType) => void;
  updatePackSelections: (lineId: string, packSelections: string[]) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "mang-crinkle-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useProducts();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Array<
          Partial<CartItem> & { product: Product }
        >;
        setItems(parsed.map((item) => normalizeCartItem(item)));
      }
    } catch {
      // ignore parse errors
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (product: Product, quantity = 1, options?: AddItemOptions) => {
      const milk: MilkType | undefined = isDrink(product) ? "whole" : undefined;
      const packSelections = isPack(product)
        ? options?.packSelections
        : undefined;

      if (isPack(product)) {
        if (
          !packSelections ||
          !isPackSelectionsComplete(
            products,
            packSelections,
            getPackSize(product)
          )
        ) {
          return;
        }
      }

      const lineId = getCartLineId(product, { milk, packSelections });

      setItems((prev) => {
        const existing = prev.find((item) => item.lineId === lineId);
        if (existing) {
          return prev.map((item) =>
            item.lineId === lineId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [
          ...prev,
          { lineId, product, quantity, milk, packSelections },
        ];
      });
      setIsOpen(true);
    },
    [products]
  );

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.lineId !== lineId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.lineId === lineId ? { ...item, quantity } : item
      )
    );
  }, []);

  const updateMilk = useCallback((lineId: string, milk: MilkType) => {
    setItems((prev) => {
      const item = prev.find((i) => i.lineId === lineId);
      if (!item || !isDrink(item.product)) return prev;

      const newLineId = getCartLineId(item.product, { milk });
      if (newLineId === lineId) return prev;

      const without = prev.filter((i) => i.lineId !== lineId);
      const existing = without.find((i) => i.lineId === newLineId);

      if (existing) {
        return without.map((i) =>
          i.lineId === newLineId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...without, { ...item, lineId: newLineId, milk }];
    });
  }, []);

  const updatePackSelections = useCallback(
    (lineId: string, packSelections: string[]) => {
      setItems((prev) => {
        const item = prev.find((i) => i.lineId === lineId);
        if (!item || !isPack(item.product)) return prev;
        if (
          !isPackSelectionsComplete(
            products,
            packSelections,
            getPackSize(item.product)
          )
        ) {
          return prev;
        }

        const newLineId = getCartLineId(item.product, { packSelections });
        if (newLineId === lineId) {
          return prev.map((i) =>
            i.lineId === lineId ? { ...i, packSelections } : i
          );
        }

        const without = prev.filter((i) => i.lineId !== lineId);
        const existing = without.find((i) => i.lineId === newLineId);

        if (existing) {
          return without.map((i) =>
            i.lineId === newLineId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        }

        return [
          ...without,
          { ...item, lineId: newLineId, packSelections },
        ];
      });
    },
    [products]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + getItemUnitPrice(products, item) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        updateMilk,
        updatePackSelections,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
