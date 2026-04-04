import React from "react";

interface SparkleProps {
  style?: React.CSSProperties;
  size?: number;
  color?: string;
  delay?: number;
}

export function Sparkle({ style, size = 8, color = "hsl(40, 80%, 55%)", delay = 0 }: SparkleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className="animate-sparkle absolute pointer-events-none"
      style={{ animationDelay: `${delay}s`, ...style }}
    >
      <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
    </svg>
  );
}
