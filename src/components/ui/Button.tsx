import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const base =
  "inline-flex items-center gap-2 rounded-sm px-6 py-3 font-sans text-[15px] font-medium transition-colors";

const variants: Record<ButtonVariant, string> = {
  primary:
    "text-ink underline decoration-signal decoration-2 underline-offset-4 hover:text-signal dark:text-ink-dark dark:hover:text-signal-dark",
  secondary:
    "border border-structure/40 text-ink hover:border-structure hover:bg-structure-soft dark:border-structure-dark/40 dark:text-ink-dark dark:hover:border-structure-dark dark:hover:bg-structure-dark-soft",
};

export function Button({ variant = "secondary", className = "", children, ...rest }: ButtonProps) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}
