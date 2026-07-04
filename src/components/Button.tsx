import Link from "next/link";
import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "cream" | "red" | "yellow" | "white" | "brown" | "outline" | "outline-dark";
type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  pop?: boolean;
  className?: string;
  children: ReactNode;
}

interface ButtonAsButton
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> {
  href?: undefined;
}

interface ButtonAsLink
  extends BaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClass: Record<ButtonVariant, string> = {
  cream: "",
  red: "push-btn--red",
  yellow: "push-btn--yellow",
  brown: "push-btn--brown",
  white: "push-btn--white",
  outline: "push-btn--outline",
  "outline-dark": "push-btn--outline-dark",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "push-btn--sm",
  md: "",
  lg: "push-btn--lg",
};

function buildClasses({
  variant = "cream",
  size = "md",
  fullWidth = false,
  pop = false,
  className = "",
}: Omit<BaseProps, "children">) {
  return [
    "push-btn",
    variantClass[variant],
    sizeClass[size],
    fullWidth ? "push-btn--full" : "inline-block",
    pop ? "push-btn--pop" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Button({
  variant = "cream",
  size = "md",
  fullWidth = false,
  pop = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = buildClasses({ variant, size, fullWidth, pop, className });
  const surfaceClasses = `push-btn__surface${fullWidth ? " w-full" : ""}`;

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    const isExternal = href.startsWith("http") || href.startsWith("#");

    if (isExternal) {
      return (
        <a href={href} className={classes} {...rest}>
          <span className={surfaceClasses}>{children}</span>
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...rest}>
        <span className={surfaceClasses}>{children}</span>
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonAsButton;

  return (
    <button type={type} className={classes} {...buttonProps}>
      <span className={surfaceClasses}>{children}</span>
    </button>
  );
}
