"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen bg-[#1a120e] text-mang-cream flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md border border-mang-orange/40 bg-mang-cream-light text-mang-brown shadow-[6px_6px_0_rgba(0,0,0,0.35)]">
        <div className="border-b border-mang-tan bg-mang-cream px-6 py-5">
          <p className="font-display text-[34px] leading-none tracking-wide text-mang-brown">
            MANG CRINKLE
          </p>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-mang-brown-mid/70">
            Content studio sign-in
          </p>
        </div>

        <form action={formAction} className="space-y-4 px-6 py-6">
          <p className="text-[14px] leading-relaxed text-mang-brown-mid">
            Private admin for Mang Crinkle only. Sign in to edit products and
            website content.
          </p>

          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
              Email
            </span>
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              className="w-full border border-mang-brown/30 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-mang-brown"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
              Password
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              className="w-full border border-mang-brown/30 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-mang-brown"
            />
          </label>

          {state.error ? (
            <p
              className="border border-mang-brown/20 bg-mang-tan/40 px-3 py-2 text-[13px]"
              role="alert"
            >
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full border border-mang-brown bg-mang-orange-bright px-4 py-3 text-[12px] font-extrabold uppercase tracking-[0.18em] text-mang-brown disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
