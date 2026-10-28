"use client";

import type { ReactNode } from "react";

export default function ConfirmSubmit({
  message,
  children,
  className,
  form,
}: {
  message: string;
  children: ReactNode;
  className?: string;
  form?: string;
}) {
  return (
    <button
      type="submit"
      form={form}
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
