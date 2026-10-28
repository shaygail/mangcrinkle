"use client";

export default function StorefrontError() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="font-display text-4xl text-mang-brown">Shop unavailable</h1>
      <p className="mt-3 text-mang-brown-mid">
        The published catalogue could not be loaded. Nothing here is sample menu data.
      </p>
    </div>
  );
}
