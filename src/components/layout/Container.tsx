import type { ElementType, ReactNode } from "react";

interface ContainerProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

export function Container({ as: Tag = "div", children, className = "" }: ContainerProps) {
  return <Tag className={`mx-auto w-full max-w-[1400px] px-6 md:px-10 ${className}`}>{children}</Tag>;
}
