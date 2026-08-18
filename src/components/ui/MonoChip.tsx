import type { ReactNode } from "react";

interface MonoChipProps {
  children: ReactNode;
  tone?: "structure" | "signal";
}

const tones: Record<NonNullable<MonoChipProps["tone"]>, string> = {
  structure:
    "border-structure/30 text-structure dark:border-structure-dark/40 dark:text-structure-dark",
  signal: "border-signal/40 text-signal dark:border-signal-dark/50 dark:text-signal-dark",
};

export function MonoChip({ children, tone = "structure" }: MonoChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-3 py-1 font-mono text-xs tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
