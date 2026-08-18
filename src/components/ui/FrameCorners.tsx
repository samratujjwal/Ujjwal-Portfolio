import type { ReactNode } from "react";

interface FrameCornersProps {
  children: ReactNode;
  className?: string;
}

const CORNERS = [
  { name: "top-left", position: "top-0 left-0", rotation: "rotate-0" },
  { name: "top-right", position: "top-0 right-0", rotation: "rotate-90" },
  { name: "bottom-right", position: "bottom-0 right-0", rotation: "rotate-180" },
  { name: "bottom-left", position: "bottom-0 left-0", rotation: "-rotate-90" },
] as const;

/**
 * Wraps content in the "spec-sheet" corner-tick frame from the identity
 * system — four small brackets instead of a full border, so the frame
 * reads as an annotation mark rather than a decorative box. Contrast is
 * deliberately higher than a hairline — this is a signature motif, not
 * a subtle background detail, and needs to read against dark screenshots.
 */
export function FrameCorners({ children, className = "" }: FrameCornersProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      {CORNERS.map((corner) => (
        <CornerTick key={corner.name} name={corner.name} position={corner.position} rotation={corner.rotation} />
      ))}
    </div>
  );
}

function CornerTick({ name, position, rotation }: { name: string; position: string; rotation: string }) {
  return (
    <svg
      aria-hidden="true"
      data-corner-tick={name}
      viewBox="0 0 18 18"
      className={`pointer-events-none absolute h-5 w-5 text-structure dark:text-structure-dark ${position} ${rotation}`}
    >
      <path d="M0 0 H18 M0 0 V18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="square" />
    </svg>
  );
}