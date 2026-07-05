"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { PLACEHOLDERS } from "@/lib/images";

type ProductImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string;
  alt: string;
  fallback?: string;
};

export default function ProductImage({
  src,
  alt,
  fallback = PLACEHOLDERS.cookie,
  className,
  fill,
  ...props
}: ProductImageProps) {
  const resolvedSrc = src || fallback;
  const [imgSrc, setImgSrc] = useState(resolvedSrc);
  const [showAlt, setShowAlt] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallback);
    setShowAlt(false);
  }, [src, fallback]);

  const altFallbackClass = fill
    ? `absolute inset-0 ${className ?? ""}`
    : className;

  if (showAlt) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-mang-tan text-mang-brown p-4 text-center ${altFallbackClass ?? ""}`}
        role="img"
        aria-label={alt}
      >
        <span className="text-3xl mb-2" aria-hidden="true">
          🍪
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-snug">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      fill={fill}
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
          return;
        }
        setShowAlt(true);
      }}
    />
  );
}
