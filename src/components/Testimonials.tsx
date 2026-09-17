"use client";

import { useState } from "react";
import { HomepageContent, HomepageTestimonial } from "@/data/homepage";

interface TestimonialsProps {
  content: HomepageContent;
  testimonials: HomepageTestimonial[];
}

export default function Testimonials({
  content,
  testimonials,
}: TestimonialsProps) {
  const [current, setCurrent] = useState(0);

  if (testimonials.length === 0) return null;

  const item = testimonials[current];

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-mang-cream-light">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-4xl text-mang-brown mb-4 leading-none" aria-hidden>
          &ldquo;
        </p>
        <blockquote className="text-base sm:text-lg italic text-mang-brown leading-relaxed mb-4">
          {item.quote}
        </blockquote>
        <cite className="text-[12px] font-bold uppercase tracking-[0.1em] text-mang-brown-mid not-italic">
          — {item.author}
        </cite>

        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setCurrent(i)}
                className="min-h-11 min-w-11 flex items-center justify-center"
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === current}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === current ? "bg-mang-brown" : "bg-mang-tan-dark"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
        {/* Keep CMS title available to screen readers if set */}
        <span className="sr-only">{content.testimonialsTitle}</span>
      </div>
    </section>
  );
}
