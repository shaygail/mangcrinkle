export interface StorefrontCopy {
  cartTitle: string;
  cartEmptyTitle: string;
  cartEmptyBody: string;
  cartEmptyCta: string;
  cartCheckoutCta: string;
  checkoutTitle: string;
  checkoutSubmitCta: string;
  confirmationTitle: string;
  confirmationBody: string;
  confirmationCta: string;
}

export const fallbackStorefrontCopy: StorefrontCopy = {
  cartTitle: "Your Sweet Box",
  cartEmptyTitle: "Your Box is Empty!",
  cartEmptyBody:
    "There is currently no handcrafted sweet cookie magic inside your box. Create a custom bundle of fudgy crinkles for same-day pickup now!",
  cartEmptyCta: "🍪 Start Building Your Box",
  cartCheckoutCta: "🔒 Proceed to Secure Checkout",
  checkoutTitle: "Secure Checkout",
  checkoutSubmitCta: "Place Order",
  confirmationTitle: "Order is Confirmed!",
  confirmationBody:
    "Your fresh batch of soft-centred crinkle magic is officially locked in. Swing by during your window for the perfect warm cookie experience.",
  confirmationCta: "← Back to Crinkle Shop",
};
