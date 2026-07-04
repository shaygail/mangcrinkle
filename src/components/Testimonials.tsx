"use client";

import { useState } from "react";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="py-16 lg:py-24 bg-mang-tan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="menu-title-3d text-4xl lg:text-5xl text-center mb-4 leading-tight">
          They Bite.
          <br />
          They Crave.
          <br />
          They Come Back.
        </h2>

        <div className="max-w-2xl mx-auto mt-12 text-center">
          <blockquote className="text-lg lg:text-xl italic text-mang-brown-mid mb-6 leading-relaxed font-serif">
            &ldquo;{testimonials[current].quote}&rdquo;
          </blockquote>
          <cite className="font-bold text-mang-brown not-italic">
            {testimonials[current].author}
          </cite>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() =>
                setCurrent(
                  (c) => (c - 1 + testimonials.length) % testimonials.length
                )
              }
              className="p-2 border-2 border-mang-brown/25 rounded-full hover:border-mang-brown text-mang-brown transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === current ? "bg-mang-brown" : "bg-mang-tan-dark"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
              className="p-2 border-2 border-mang-brown/25 rounded-full hover:border-mang-brown text-mang-brown transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
